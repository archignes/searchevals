import React from 'react'; 
import '../src/styles/globals.css';
import { DataProvider } from '../src/components/DataContext';
import { AppProps } from 'next/app';
import { StrictMode } from 'react';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import SearchBar from '../src/components/SearchBar';
import FeedbackButton from '../src/components/FeedbackButton';
function MyApp({ Component, pageProps }: AppProps) {
    return (
        <StrictMode>
        <DataProvider>          
            <FeedbackButton/>
            <Header />
            <SearchBar />
            <Component {...pageProps} />
            <Footer />
        </DataProvider>
        </StrictMode>

    );
}

export default MyApp;