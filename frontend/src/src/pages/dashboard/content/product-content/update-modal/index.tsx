import { Modal } from '../../../../../components/modal';
import { IoIosClose } from 'react-icons/io';
import { ProductNameUpdate } from './product-name-price';
import { ProductImagesUpdate } from './product-images';
import { ProductDescriptionUpdate } from './product-description';
import { ProductFreebiesUpdate } from './product-freebies';
import Stepper from '../../../../../components/stepper';
import { Form } from '../../../../../components/ui/form';
import { UpdateProductRequest, UpdateProductResponse, updateProductRequest } from '../../../../../service/product-service/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { imagePreviewUpdateAtom, productDescription2AtomUpdate, productDescription2ViaPropsAtomUpdate, productDiscountedPriceAtomUpdate, productFreebiesAtomUpdate, productImgAtomUpdate, productImgViaPropsAtomUpdate, productStatusUpdateAtom } from '../../../../../atom/productDetailsAtom';
import { useMutation, useQueryClient } from 'react-query';
import { AxiosError } from 'axios';
import { updateProduct } from '../../../../../service/product-service';
import { uploadToS3 } from '../../../../../utility/s3bucket';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

interface Xprox {
    isVisible: boolean;
    handleClose: () => void;
    productId: string;
    img: string;
    productName: string;
    originalPrice: number,
    discount: number,
    supplierPrice: number,
    discountedPrice: number,
    originalQuantity: number,
    currentQuantity: number,
    productSold: number,
    productFreebies: string,
    description1: string,
    description2: string,
    productStatus: string
}

export const ModalViewUpdate = (props: Xprox) => {

  const productId = props.productId ? props.productId : uuidv4();
  const [ productStatusValueUpdate, ] = useAtom(productStatusUpdateAtom);

  const [ selectedImages, setSelectedImages ] = useAtom(productImgAtomUpdate);
  const [ bulletDescriptions, setBulletDescriptions ] = useAtom(productDescription2AtomUpdate);
  const [ freebies, setFreebies ] = useAtom(productFreebiesAtomUpdate);
  const [ discountedPrice, setDiscountedPrice ] = useAtom(productDiscountedPriceAtomUpdate);
  const queryClient = useQueryClient();
  const notify = () => toast.success("Successfully updated!");

  //Via Props
  const [ selectedImagesViaProps, setSelectedImagesViaProps ] = useAtom(productImgViaPropsAtomUpdate);
  const [ selectedDescription2ViaProps, setselectedDescription2ViaProps ] = useAtom(productDescription2ViaPropsAtomUpdate);
  const [, setImagePreviews] = useAtom(imagePreviewUpdateAtom);

  const productFormUpdate = useForm<UpdateProductRequest>({
      defaultValues: {
          productId: productId,
          productName: props.productName,
          img: props.img,
          discount: props.discount,
          supplierPrice: props.supplierPrice,
          originalPrice: props.originalPrice,
          discountedPrice: props.discountedPrice,
          description1: props.description1,
          description2: props.description2,
          productSold: props.productSold,
          productFreebies: props.productFreebies,
          productStatus: props.productStatus
      },
      mode: 'onChange',
      resolver: zodResolver(updateProductRequest),
  });

  const { mutate: updateProductMu } = useMutation<
    UpdateProductResponse,
    AxiosError,
    UpdateProductRequest
  >((data) => updateProduct(data), {
    onSuccess: () => {
      setDiscountedPrice(0);
      setBulletDescriptions([]);
      setSelectedImages([]);
      setSelectedImagesViaProps([]);
      setselectedDescription2ViaProps([]);
      setImagePreviews([]);
      setFreebies([]);
      queryClient.invalidateQueries('product-data');
      productFormUpdate.reset();
      notify();
      props.handleClose()
    },
    onError: (error: unknown) => {
    console.log(error);
  },
  });
 
  const handleUpdateProduct = async (data: UpdateProductRequest) => {
      const freebiesIds = freebies.map(freebie => freebie.freebiesId);
      const uploadedImageUrls = await uploadToS3(selectedImages);
      
      // Convert the combined image URLs array to JSON
      const combineUploadedImageUrls = [...selectedImagesViaProps.flat(), ...uploadedImageUrls];
      const imgJson = JSON.stringify(combineUploadedImageUrls).trim();

      const combineDescription2 = [...selectedDescription2ViaProps.flat(), ...bulletDescriptions];
      const description2Json = JSON.stringify(combineDescription2).trim();

      const params: UpdateProductRequest = {
          productId: productId,
          productName: data.productName,
          img: imgJson,
          discount: data.discount,
          supplierPrice: data.supplierPrice,
          originalPrice: data.originalPrice,
          discountedPrice: discountedPrice,
          description1: data.description1,
          description2: description2Json,
          productSold: data.productSold,
          productFreebies: JSON.stringify(freebiesIds).trim(),
          productStatus: productStatusValueUpdate
      };
      updateProductMu(params);  
  };
 
  const handleCloseAdd = () => {
    productFormUpdate.reset();
    setDiscountedPrice(0);
    setBulletDescriptions([]);
    setSelectedImages([]);
    setSelectedImagesViaProps([]);
    setselectedDescription2ViaProps([]);
    setImagePreviews([]);
    setFreebies([]);
    queryClient.invalidateQueries('freebies-data-update');
    localStorage.removeItem('currentQuantityValue');
    props.handleClose()
  }

  return (
    <Modal open={props.isVisible} onClose={props.handleClose}>
      <div className='flex flex-col justify-start w-[66rem] h-[36rem] bg-white p-8 overflow-auto'>
            <button onClick={handleCloseAdd} className='flex justify-end items-end w-full'>
              <IoIosClose  className='w-6 h-6 text-[#808080] cursor-pointer' />
            </button>
            <div className='mt-6 w-full h-full'>
            <Form {...productFormUpdate}>
              <form onSubmit={productFormUpdate.handleSubmit(handleUpdateProduct)} className='mt-2 w-full h-full'>
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
                      productFormUpdate.reset();
                      setDiscountedPrice(0);
                      setSelectedImages([]);
                      setFreebies([]);
                      setBulletDescriptions([]);
                      setSelectedImagesViaProps([]);
                      setImagePreviews([]);
                      setselectedDescription2ViaProps([]);
                      queryClient.invalidateQueries('freebies-data-update');
                    }
                  }}
                  allowClickControl={false}
                  >
                  <div className='stepperSubDiv'>
                      <ProductNameUpdate productStatus={props.productStatus} productName={props.productName} productSold={props.productSold} supplierPrice={props.supplierPrice} originalPrice={props.originalPrice} discount={props.discount} discountedPrice={props.discountedPrice} />
                  </div>
                  <div className='stepperSubDiv'>
                      <ProductImagesUpdate img={props.img} />
                  </div>
                  <div className='stepperSubDiv'>
                      <ProductDescriptionUpdate description1={props.description1} description2={props.description2} />
                  </div>
                  <div className='stepperSubDiv'>
                      <ProductFreebiesUpdate productFreebies={props.productFreebies} />
                  </div>
                  </Stepper>
                  </form>
            </Form>
            </div>
      </div>
    </Modal>
  )
}
