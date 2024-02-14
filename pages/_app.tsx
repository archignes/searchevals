import React from 'react'; 
import '../src/styles/globals.css';
import { DataProvider } from '../src/components/DataContext';
import { AppProps } from 'next/app';
import { StrictMode } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <StrictMode>
        <DataProvider>
            <Component {...pageProps} />
        </DataProvider>
        </StrictMode>

    );
}

export default MyApp;