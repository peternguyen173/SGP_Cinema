import React, { useState, useEffect } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './HomeSlider.css'

import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';


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
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log("Banners fetched successfully:", data);
                setBanners(data.banners); // Update banners from server
            } else {
                console.error("Failed to fetch banners.");
            }
        } catch (error) {
                console.error("Error:", error);
        }
    };

    return (
        <div className='s'>
            <h1>Banner</h1>
            <Swiper
                cssMode={true}
                navigation={true}
                pagination={true}
                mousewheel={true}
                keyboard={true}
                modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                className="mySwiper"
            >
                {banners.map((banner, index) => (
                    <SwiperSlide key={index}>
                        <Image
                            src={banner.imageUrl}
                            alt=""
                            width={width}
                            height={height / 2}
                            style={{ objectFit: "cover" }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default HomeSlider;
