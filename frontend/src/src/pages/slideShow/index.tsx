
import { useQuery } from 'react-query';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import { getAllHomeImages } from '../../service/home-images';

export const SlideShow = () => {

    const { data: homeImagesData } = useQuery(
        ['home-images-data'],
        () => getAllHomeImages(),
    );
      
    const divStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }

    const slideImages = [
        {
            url: 'https://images.unsplash.com/photo-1604242692760-2f7b0c26856d?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            url: 'https://images.unsplash.com/photo-1609587312208-cea54be969e7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            url: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            url: 'https://images.unsplash.com/photo-1612817159623-0399784fd0ce?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            url: 'https://images.unsplash.com/photo-1617317376997-8748e6862c01?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
    ];

    return (
        <div className="slide-container">
             {(!homeImagesData?.homeImagesData || homeImagesData.homeImagesData.length === 0) ? 
                <Slide>
                    {slideImages.map((slideImage, index)=> (
                        <div key={index}>
                        <div className='h-[700px] max-sm:h-[300px]' style={{ ...divStyle, 'backgroundImage': `url(${slideImage.url})` }}>
                            
                        </div>
                    </div>
                ))} 
                </Slide>
             : 
                <>
                {homeImagesData?.homeImagesData && homeImagesData?.homeImagesData.map((slideImage) => (
                        <Slide>
                            {slideImage.homeImg.replace(/\\/g, '').replace(/"/g, '').replace(/\[/g, '').replace(/\]/g, '').split(',').map((url, urlIndex) => (
                                <div key={urlIndex} className='h-[700px] max-sm:h-[300px]' style={{ ...divStyle, 'backgroundImage': `url(${url})` }}></div> 
                        ))}
                        </Slide>
                ))} 
                </>
            }
      </div>
    )
}
