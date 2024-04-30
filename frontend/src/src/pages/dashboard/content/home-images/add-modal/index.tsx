import { Modal } from '../../../../../components/modal';
import { IoIosClose } from 'react-icons/io';
import Stepper from '../../../../../components/stepper';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../../../../../components/ui/form';
import { toast } from 'react-toastify';
import { useAtom } from 'jotai';
import { AImagesModal } from './aImages';
import { SaveHomeImagesRequest, SaveHomeImagesResponse, homeImagesRequest } from '../../../../../service/home-images/schema';
import { saveHomeImages } from '../../../../../service/home-images';
import { homeImgAtom } from '../../../../../atom/homeImagesAtom';
import { uploadToS3Dashboard } from '../../../../../utility/s3bucket-dashboard';

interface Xprox {
    isVisible: boolean;
    handleClose: () => void;
}

export const AddModalView = (props: Xprox) => {

  const queryClient = useQueryClient();
  const notify = () => toast.success("Successfully added!");
  const [ selectedImages ] = useAtom(homeImgAtom);

  const homeImagesForm = useForm<SaveHomeImagesRequest>({
    defaultValues: {
        homeImg: '',
    },
    mode: 'onChange',
    resolver: zodResolver(homeImagesRequest),
  });

  const { mutate: homeImagesMu } = useMutation<
    SaveHomeImagesResponse,
    AxiosError,
    SaveHomeImagesRequest
  >((data) => saveHomeImages(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('home-images-data');
      notify()
      props.handleClose()
    },
    onError: (error: unknown) => {
    console.log(error);
  },
  });

  const handleSaveHomeImages = async () => {
    const uploadedImageUrls = await uploadToS3Dashboard(selectedImages);
    const params: SaveHomeImagesRequest = {
        homeImg: uploadedImageUrls,
    };
    homeImagesMu(params);
  };

  const handleCloseAdd = () => {
    homeImagesForm.reset();
    props.handleClose()
  }

    return (
      <Modal open={props.isVisible} onClose={handleCloseAdd}>
        <div className='flex flex-col justify-start w-[66rem] h-[36rem] bg-white p-8 overflow-auto'>
              <button onClick={handleCloseAdd} className='flex justify-end items-end w-full'>
                <IoIosClose  className='w-8 h-8 text-[#808080] cursor-pointer' />
              </button>
              <Form {...homeImagesForm}>
                <form onSubmit={homeImagesForm.handleSubmit(handleSaveHomeImages)} className='mt-2 w-full h-full'>
                <Stepper
                      strokeColor='#17253975'
                      fillStroke='#172539'
                      activeColor='#172539'
                      activeProgressBorder='2px solid #17253975'
                      submitBtn={<button type='submit' className={`stepperBtn ${selectedImages.length <= 0 ? 'opacity-55' : null}`} disabled={selectedImages.length <= 0 ? true : false}>Submit</button>}
                      continueBtn={<button className='stepperBtn'>Next</button>}
                      backBtn={<button className='stepperBtn'>Back</button>}
                      >
                      <div className='stepperSubDiv'>
                          <AImagesModal />
                      </div>
                      </Stepper>
                </form>
              </Form>
        </div>
      </Modal>
    )
}

