import React from 'react';
import { 
    Typography, 
    Button, 
    Box, 
    Card, 
    CardContent, 
    Grid, 
    Container,
    Paper,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { 
    TrendingDown, 
    Notifications, 
    CalendarToday, 
    Add, 
    Star,
    CheckCircle,
    TheaterComedy,
    AccessTime,
    LocationOn,
    People,
    AttachMoney
} from '@mui/icons-material';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FreeMode, Pagination, Navigation } from "swiper/modules";
import './landing.css';

function Landing() {
    const deals = [
        { id: 7, show: 'Wicked', price: '$1', discount: '99% off', image: '//images.ctfassets.net/6pezt69ih962/1TFanbKe0SLnWaFeM3tfOP/c8450fbcb88dd03b882de0d0a78ffac5/GH6fvZ2XIAAxfdZ.jpeg' },
        { id: 1, show: 'Hamilton', price: '$10', discount: '91% off', image: '//images.ctfassets.net/6pezt69ih962/1y7NNsY4SEuHZKPNKmkW94/db8358a9baeb77575361e19d393e4d31/Stephanie_Jae_Park__Jennie_Harney-Fleming__Yana_Perrault_in_Hamilton_on_Broadway_-__c__Joan_Marcus_2024.jpg' },
        { id: 6, show: 'Book of Mormon', price: '$11', discount: '86% off', image: '//images.ctfassets.net/6pezt69ih962/3ewlfT0LvfBLnEsGOH4P2x/13d3aa6b139c2fad58f12fec3db7a8f4/1.png' },
        { id: 3, show: '&Juliet', price: '$9', discount: '88% off', image: '//images.ctfassets.net/6pezt69ih962/1PKuClN1WWNXTRcSScrKAj/d22dc47aff97cc01f7bc64b7c7adf0cf/Header__Image_2.png' },
        { id: 2, show: 'Six', price: '$14', discount: '84% off', image: '//images.ctfassets.net/6pezt69ih962/3wFoZgddqx9k4bdcZMPerQ/c4c71ec3d4aaeee2361f0c76daa2fb6a/_1__SixBway240001r.jpg' },
        { id: 16, show: 'Aladdin', price: '$15', discount: '78% off', image: '//images.ctfassets.net/6pezt69ih962/1RuhHtESrcX8AFgaV9fd7Y/6c579e88870eb5c6756b7af7134607a8/Aladdin_5.jpg' },
        { id: 5, show: 'The Outsiders', price: '$10', discount: '88% off', image: '//images.ctfassets.net/6pezt69ih962/4jsZLNXpX4ZidCz2IxvThL/f31ef4b1a015e5147179fc9f3fdc38a1/01._The_Outsiders_-_The_Greasers_-_Photo_by_Matthew_Murphy.jpg' },
        { id: 42, show: 'Death Becomes Her', price: '$20', discount: '68% off', image: '//images.ctfassets.net/6pezt69ih962/2BY7Bsd481QHT10WBasGYD/fc3920941c238880a65bf50d5ff740fb/DBH_019_PA_BWAY_PRODUCTION_PHOTOS_TICKETING_SITES_TodayTix_1600x1200_Image_2__1_.jpg' },
    ];

    const features = [
        {
            icon: <TrendingDown sx={{ fontSize: 40, color: '#156064' }} />,
            title: 'Find the Cheapest Tickets',
            description: 'Discover the lowest prices across all Broadway shows and live events in real-time.'
        },
        {
            icon: <Notifications sx={{ fontSize: 40, color: '#156064' }} />,
            title: 'Smart Price Alerts',
            description: 'Set up personalized alerts for specific shows, price points, or date ranges.'
        },
        {
            icon: <CalendarToday sx={{ fontSize: 40, color: '#156064' }} />,
            title: 'Date-Based Search',
            description: 'Find the best deals within your preferred travel dates and availability.'
        },
        {
            icon: <Add sx={{ fontSize: 40, color: '#156064' }} />,
            title: 'Add Custom Events',
            description: 'Track shows that aren\'t in our database yet - perfect for concerts and sports.'
        }
    ];

    const alertFeatures = [
        'Choose specific events or entire categories',
        'Set price thresholds or percentage discounts',
        'Filter by date ranges and show times',
        'Select preferred weekdays',
        'Set minimum advance notice (avoid last-minute surprises)',
        'Compare prices with TodayTix for the best deal'
    ];

    return (
        <div className="landing">
            {/* Hero Section */}
            <section className="hero">
                <Container maxWidth="lg">
                    <Box className="hero-content">
                        <Typography variant="h1" className="hero-title">
                            Unlock Broadway's Best Deals
                        </Typography>
                        <Typography variant="h4" className="hero-subtitle">
                            Discover incredible discounts on live events making Broadway accessible to everyone
                        </Typography>
                        <Typography variant="body1" className="hero-description">
                            StubHub can have amazing deals on Broadway shows and live events, but finding them requires perfect timing. 
                            We uncover these deals for you, so you can experience world-class entertainment at unbelievable prices.
                        </Typography>
                        
                        {/* Statistics */}
                        <Box className="hero-stats">
                            <Box className="stat-item">
                                <LocalActivityIcon className="stat-icon" />
                                
                                <Typography variant="h4" className="stat-number">$15K+</Typography>
                                <Typography variant="body2" className="stat-label">Tickets Sold</Typography>
                            </Box>
                            <Box className="stat-item">
                                <People className="stat-icon" />
                                <Typography variant="h4" className="stat-number">250+</Typography>
                                <Typography variant="body2" className="stat-label">Happy Customers</Typography>
                            </Box>
                        </Box>
                        
                        <Box className="hero-buttons">
                            <Button 
                                variant="contained" 
                                size="large" 
                                href="/alerts"
                                className="cta-button primary"
                            >
                                Set Up Price Alerts
                            </Button>
                            <Button 
                                variant="outlined" 
                                size="large" 
                                href="/deals"
                                className="cta-button secondary"
                            >
                                Browse Current Deals
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </section>

            {/* Deals Showcase */}
            <section className="deals-showcase">
                <Container maxWidth="lg">
                    <Typography variant="h2" className="section-title">
                        Real Deals We've Found
                    </Typography>
                    <Typography variant="body1" className="section-subtitle">
                        These aren't just examples - these are actual deals our users have discovered through our platform
                    </Typography>
                    
                    <Box className="deals-slider-container">
                        <Swiper
                            className="deals-slider"
                            modules={[FreeMode, Pagination, Navigation]}
                            spaceBetween={24}
                            slidesPerView={1}
                            freeMode={true}
                            grabCursor={true}
                            navigation={{
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                            }}
                            pagination={{
                                clickable: true,
                            }}
                            breakpoints={{
                                576: {
                                    slidesPerView: 1.5,
                                    spaceBetween: 16,
                                },
                                768: {
                                    slidesPerView: 2.5,
                                    spaceBetween: 20,
                                },
                                992: {
                                    slidesPerView: 3.5,
                                    spaceBetween: 24,
                                }
                            }}
                        >
                            {deals.map((deal, index) => (
                                <SwiperSlide key={index}>
                                    <Card className="deal-card">
                                        <Box className="deal-image-container">
                                            <img 
                                                src={deal.image} 
                                                alt={deal.show} 
                                                className="deal-image"
                                            />
                                            <Box className="deal-overlay">
                                                <Chip 
                                                    label={deal.discount} 
                                                    className="deal-discount"
                                                    color="success"
                                                />
                                            </Box>
                                        </Box>
                                        <CardContent className="deal-content">
                                            <Typography variant="h6" className="deal-show">
                                                {deal.show}
                                            </Typography>
                                            <Typography variant="h4" className="deal-price">
                                                {deal.price}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        
                        <div className="swiper-button-prev"></div>
                        <div className="swiper-button-next"></div>
                    </Box>
                </Container>
            </section>

            {/* Features Section */}
            <section className="features">
                <Container maxWidth="lg">
                    <Typography variant="h2" className="section-title">
                        How It Works
                    </Typography>
                    <Typography variant="body1" className="section-subtitle">
                        Our platform makes finding affordable Broadway tickets simple and effective
                    </Typography>
                    
                    <Grid container spacing={4} className="features-grid">
                        {features.map((feature, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <Paper className="feature-card">
                                    <Box className="feature-icon">
                                        {feature.icon}
                                    </Box>
                                    <Typography variant="h5" className="feature-title">
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body1" className="feature-description">
                                        {feature.description}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </section>

            {/* Alert System Section */}
            <section className="alert-system">
                <Container maxWidth="lg">
                    <Box className="alert-content">
                        <Box className="alert-text">
                            <Typography variant="h2" className="section-title">
                                Smart Price Alerts
                            </Typography>
                            <Typography variant="body1" className="section-subtitle">
                                Our advanced alert system ensures you never miss the perfect deal
                            </Typography>
                            
                            <List className="alert-features-list">
                                {alertFeatures.map((feature, index) => (
                                    <ListItem key={index} className="alert-feature-item">
                                        <ListItemIcon>
                                            <CheckCircle className="check-icon" />
                                        </ListItemIcon>
                                        <ListItemText primary={feature} />
                                    </ListItem>
                                ))}
                            </List>
                            
                            <Button 
                                variant="contained" 
                                size="large" 
                                href="/alerts"
                                className="cta-button primary"
                                startIcon={<Notifications />}
                            >
                                Create Your First Alert
                            </Button>
                        </Box>
                        
                        <Box className="alert-visual">
                            <Paper className="alert-demo">
                                <Box className="alert-demo-header">
                                    <Typography variant="h6">Price Alert Example</Typography>
                                </Box>
                                <Box className="alert-demo-content">
                                    <Box className="alert-demo-item">
                                        <TheaterComedy className="demo-icon" />
                                        <Typography variant="body2">Hamilton</Typography>
                                    </Box>
                                    <Box className="alert-demo-item">
                                        <TrendingDown className="demo-icon" />
                                        <Typography variant="body2">Under $50</Typography>
                                    </Box>
                                    <Box className="alert-demo-item">
                                        <CalendarToday className="demo-icon" />
                                        <Typography variant="body2">Next 30 days</Typography>
                                    </Box>
                                    <Box className="alert-demo-item">
                                        <AccessTime className="demo-icon" />
                                        <Typography variant="body2">Evening shows only</Typography>
                                    </Box>
                                    <Box className="alert-demo-item">
                                        <CalendarToday className="demo-icon" />
                                        <Typography variant="body2">Fri, Sat, Sun only</Typography>
                                    </Box>
                                    <Box className="alert-demo-item">
                                        <AccessTime className="demo-icon" />
                                        <Typography variant="body2">Min 4 hours notice</Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Box>
                    </Box>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <Container maxWidth="md">
                    <Typography variant="h2" className="cta-title">
                        Ready to Score Amazing Deals?
                    </Typography>
                    {/* <Typography variant="body1" className="cta-description">
                        Join thousands of theater lovers who are already saving hundreds on Broadway tickets
                    </Typography> */}
                    <Box className="cta-buttons">
                        <Button 
                            variant="contained" 
                            size="large" 
                            href="/signup"
                            className="cta-button primary large"
                        >
                            Get Started
                        </Button>
                        <Button 
                            variant="outlined" 
                            size="large" 
                            href="/deals"
                            className="cta-button secondary large"
                        >
                            Explore Current Deals
                        </Button>
                    </Box>
                </Container>
            </section>
        </div>
    );
}

export default Landing;
