import App, { Container } from 'next/app';
import Head from 'next/head';
import React from 'react';

export default class LumiledsApp extends App {
    static async getInitialProps({ Component, ctx }: any) {
        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        return { pageProps };
    }

    render() {
        const { Component, pageProps } = this.props;
        return (
            <Container>
                <Head>
                    <title>Techkids</title>
                    {/* <link href='https://www.lumileds.com/icon-normal.png' rel='icon' sizes='128x128' /> */}
                    <link href='../static/images/small-logo.png' rel='icon' sizes='128x128' />
                </Head>
                <Component {...pageProps} />
            </Container>
        );
    }
}
