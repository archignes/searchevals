import React from 'react'; 
import '../src/styles/globals.css';
import { DataProvider } from '../src/components/DataContext';
import { AppProps } from 'next/app';
import { StrictMode } from 'react';
import { AppProvider } from '../src/contexts/AppContext';
import Header from '../src/components/header/Header';
import Footer from '../src/components/Footer';
import SearchBar from '../src/components/SearchBar';
import { FeedbackAction } from '../src/components/FeedbackAction';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <StrictMode>
            <AppProvider>
        <DataProvider>
            <Header />
            <SearchBar />
            <Component {...pageProps} />
            <Footer />
            <FeedbackAction />
        </DataProvider>
        </AppProvider>
        </StrictMode>

    );
}

export default MyApp;