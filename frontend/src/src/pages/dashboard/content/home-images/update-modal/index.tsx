import { Modal } from '../../../../../components/modal';
import { IoIosClose } from 'react-icons/io';
import Stepper from '../../../../../components/stepper';
import { Form } from '../../../../../components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { useMutation, useQueryClient } from 'react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import { UpdateHomeImagesRequest, UpdateHomeImagesResponse, updateHomeImagesRequest } from '../../../../../service/home-images/schema';
import { updateHomeImages } from '../../../../../service/home-images';
import { UImagesModal } from './uImages';
import { homeImagesImgAtomUpdate, homeImagesImgViaPropsAtomUpdate, homeImagesPreviewUpdateAtom } from '../../../../../atom/homeImagesAtom';
import { uploadToS3Dashboard } from '../../../../../utility/s3bucket-dashboard';

interface Xprox {
    isVisible: boolean;
    handleClose: () => void;
    homeImagesId: string;
    homeImg: string;
}

export const UpdateModalView = (props: Xprox) => {

  const homeImagesId = props.homeImagesId ? props.homeImagesId : uuidv4();

  const [ selectedImages, setSelectedImages ] = useAtom(homeImagesImgAtomUpdate);
  const queryClient = useQueryClient();
  const notify = () => toast.success("Successfully updated!");

  //Via Props
  const [ selectedImagesViaProps, setSelectedImagesViaProps ] = useAtom(homeImagesImgViaPropsAtomUpdate);
  const [, setImagePreviews] = useAtom(homeImagesPreviewUpdateAtom);

  const homeImagesFormUpdate = useForm<UpdateHomeImagesRequest>({
      defaultValues: {
          homeImagesId: homeImagesId,
          homeImg: props.homeImg,
      },
      mode: 'onChange',
      resolver: zodResolver(updateHomeImagesRequest),
  });

  const { mutate: updateHomeImagesMu } = useMutation<
    UpdateHomeImagesResponse,
    AxiosError,
    UpdateHomeImagesRequest
  >((data) => updateHomeImages(data), {
    onSuccess: () => {
      setSelectedImages([]);
      setSelectedImagesViaProps([]);
      setImagePreviews([]);
      queryClient.invalidateQueries('home-images-data');
      homeImagesFormUpdate.reset();
      notify();
      props.handleClose()
    },
    onError: (error: unknown) => {
    console.log(error);
  },
  });
 
  const handleUpdateHomeImages = async () => {
      const uploadedImageUrls = await uploadToS3Dashboard(selectedImages);     
      // Convert the combined image URLs array to JSON
      const combineUploadedImageUrls = [...selectedImagesViaProps.flat(), ...uploadedImageUrls];
      const imgJson = JSON.stringify(combineUploadedImageUrls).trim();
   
      const params: UpdateHomeImagesRequest = {
          homeImagesId: homeImagesId,
          homeImg: imgJson,
      };
      updateHomeImagesMu(params);  
  };
 
  const handleCloseAdd = () => {
    homeImagesFormUpdate.reset();
    setSelectedImages([]);
    setSelectedImagesViaProps([]);
    setImagePreviews([]);
    queryClient.invalidateQueries('home-images-data');
    props.handleClose()
  }

  return (
    <Modal open={props.isVisible} onClose={props.handleClose}>
      <div className='flex flex-col justify-start w-[66rem] h-[36rem] bg-white p-8 overflow-auto'>
            <button onClick={handleCloseAdd} className='flex justify-end items-end w-full'>
              <IoIosClose  className='w-6 h-6 text-[#808080] cursor-pointer' />
            </button>
            <div className='mt-6 w-full h-full'>
            <Form {...homeImagesFormUpdate}>
              <form onSubmit={homeImagesFormUpdate.handleSubmit(handleUpdateHomeImages)} className='mt-2 w-full h-full'>
            <Stepper
                  strokeColor='#17253975'
                  fillStroke='#172539'
                  activeColor='#172539'
                  activeProgressBorder='2px solid #17253975'
                  submitBtn={<button className={`stepperBtn`}>Submit</button>}
                  continueBtn={<button className={`stepperBtn`} 
                  type='button'
                  >Next</button>}
                  backBtn={<button type='button' className='stepperBtn'>Back</button>}
                  onPrev={(step) => {
                    if (step === 1) {
                      setSelectedImagesViaProps([]);
                      setImagePreviews([]);
                      queryClient.invalidateQueries('home-images-data');
                    }
                  }}
                  allowClickControl={false}
                  >
                  <div className='stepperSubDiv'>
                      <UImagesModal homeImg={props.homeImg} />
                  </div>
                  </Stepper>
                  </form>
            </Form>
            </div>
      </div>
    </Modal>
  )
}
