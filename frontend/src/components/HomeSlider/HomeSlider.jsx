import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './HomeSlider.css';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';


// Import local image
import img from './../../asset/banner.jpeg'; // Adjust the path to your assets folder

const HomeSlider = () => {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        getBanners();
    }, []);

    const getBanners = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_API}/banner/getbanners`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log('Banners fetched successfully:', data);
                setBanners(data.banners); // Update banners from server
            } else {
                console.error('Failed to fetch banners.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (<div>
        <br/>

        <div className='s'>
            <Swiper
                cssMode={true}
                navigation={true}
                pagination={true}
                mousewheel={true}
                keyboard={true}
                modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                className="mySwiper"
            >
                {banners.length > 0 ? (
                    banners.map((banner, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={img} // Use local image if imageUrl is not available
                                alt=""
                                width={width}
                                height={height / 2}
                                style={{ objectFit: 'cover' }}
                            />
                        </SwiperSlide>
                    ))
                ) : (
                    <SwiperSlide>
                        <img
                            src={img}
                            alt="Default Banner"
                            width={width}
                            height={height*0.65}
                            style={{ objectFit: 'cover' }}
                        />
                    </SwiperSlide>
                )}
            </Swiper>
        </div>
        </div>
    );
}

export default HomeSlider;
