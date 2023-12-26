import React, { useEffect, useRef } from 'react'
import { scaleBand, scaleLinear, max, timeFormat, select, axisBottom, axisLeft } from 'd3';


export interface IGraphType {
    update_date: Date,
    views: number,
    likes: number,
    dislikes: number,
}

interface IVideoAnalyticsProps {
    VideoViews: number,
    AvrageTime: number,
    Likes: number,
    Dislikes: number,
    PublishDateFormated: string
    videoHistoryData: Array<IGraphType>
}
const VideoAnalytics = (props: IVideoAnalyticsProps) => {
    const chartRef = useRef<SVGSVGElement>(null);


    useEffect(() => {
        const width = 1220;
        const height = 360;
        const margin = { top: 30, right: 30, bottom: 30, left: 70 };

        const x = scaleBand()
            .domain(props.videoHistoryData.map(d => new Date(d.update_date).toISOString().substring(0, 10)))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y = scaleLinear()
            .domain([0, max(props.videoHistoryData, d => d.views) as number])
            .nice()
            .range([height - margin.bottom, margin.top]);


        const dateFormatter = timeFormat('%Y-%m-%d');

        const svg = select(chartRef.current)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        svg
            .selectAll('rect')
            .data(props.videoHistoryData)
            .enter()
            .append('rect')
            .attr('x', d => x(new Date(d.update_date).toISOString().substring(0, 10)) || 0)
            .attr('y', d => y(d.views))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(d.views) - margin.bottom)
            .attr('fill', 'steelblue')
            .on('mouseover', (event, d) => {
                // Display tooltip on mouseover
                const tooltip = svg.append('g').attr('class', 'tooltip');
                tooltip
                    .append('text')
                    .attr('x', x(new Date(d.update_date).toISOString().substring(0, 10))! + x.bandwidth() / 2)
                    .attr('y', y(d.views) - 10)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '12px')
                    .text(`Likes: ${d.likes}, Dislikes: ${d.dislikes}`);
            })
            .on('mouseout', () => {
                // Remove tooltip on mouseout
                svg.select('.tooltip').remove();
            });

        svg.append('g')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(axisBottom(x).tickFormat(d => dateFormatter(new Date(d))));

        svg.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(axisLeft(y));


    }, [chartRef]);



    return (
        <div className='flex w-full h-[25rem]'>

            <div className='bg-[#4B4B4B] w-[27.8rem] mr-auto h-[25rem]'>
                <h1 className="text-white self-center ml-[1rem] mt-[1rem] text-lg">Video Views: {props.VideoViews}</h1>
                <h1 className="text-white self-center ml-[1rem] mt-[1rem] text-lg">Avrage View Time: {props.AvrageTime} sec</h1>
                <h1 className="text-white self-center ml-[1rem] mt-[1rem] text-lg">Likes: {props.Likes}</h1>
                <h1 className="text-white self-center ml-[1rem] mt-[1rem] text-lg">Dislikes: {props.Dislikes}</h1>
                <h1 className="text-white self-center ml-[1rem] mt-[1rem] text-lg">Publish Date: {props.PublishDateFormated}</h1>

            </div>
            <div id="chart" className='bg-[#4B4B4B] w-[70%]  h-[25rem]'>
                <h1 className="text-white self-center ml-[1rem] mt-[1rem] text-sm">Views history</h1>

                <svg ref={chartRef} className='w-full h-full' />
            </div>
        </div>
    )
}

export default VideoAnalytics