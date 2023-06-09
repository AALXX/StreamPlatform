const Meta = ({ title, keywords, description }: any) => {
    return (
        <head>
            <title>{title}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="shortcut icon" href="/favicon.ico" />
            <meta name="keywords" content={keywords} />
            <meta name="description" content={description} />
            <meta charSet="utf-8" />
        </head>
    )
}

Meta.defaultProps = {
    title: 'stream_platform_name',
    keywords: 'web development, programming',
    description: `Stream `
}

export default Meta
