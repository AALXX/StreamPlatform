'use client'
import axios from 'axios'
import { getCookie } from 'cookies-next'
import { scaleBand, scaleLinear, max, interpolateRound, timeFormat, select, axisBottom, axisLeft } from 'd3';
import React, { useEffect, useRef, useState } from 'react'

interface IUserAnalytics {
    followers: number,
    update_date: Date,
    videos: number,
    total_views: number
}

interface IUserAnalyticsResp {
    error: boolean,
    UserHistoryData: IUserAnalytics[],
    userAnalyticsData: IUserAnalytics
}

export const AccountAnalytics = () => {
    const [userAnalytics, setUserAnalytics] = useState<IUserAnalyticsResp>()
    const chartRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        ; (async () => {
            const res = await axios.get(`${process.env.SERVER_BACKEND}/user-account/get-creator-analytics-data/${getCookie('userToken')}`);
            const userData = res.data;
            console.log(userData.UserHistoryData);
            setUserAnalytics(userData);
        })();
    }, []); 


    useEffect(() => {
        if (userAnalytics) {
            const width = 750;
            const height = 500;
            const margin = { top: 100, right: 30, bottom: 30, left: 70 };

            const x = scaleBand()
                .domain(userAnalytics.UserHistoryData.map(d => new Date(d.update_date).toISOString().substring(0, 10)))
                .range([margin.left, width - margin.right])
                .padding(0.1);

            const y = scaleLinear()
                .domain([0, max(userAnalytics.UserHistoryData, d => d.followers) as number])
                .nice()
                .range([height - margin.bottom, margin.top])
                .interpolate(interpolateRound);


            const dateFormatter = timeFormat('%Y-%m-%d');

            const svg = select(chartRef.current)
                .append('svg')
                .attr('width', width)
                .attr('height', height);

            svg
                .selectAll('rect')
                .data(userAnalytics.UserHistoryData)
                .enter()
                .append('rect')
                .attr('x', d => x(new Date(d.update_date).toISOString().substring(0, 10)) || 0)
                .attr('y', d => y(d.followers))
                .attr('width', x.bandwidth())
                .attr('height', d => height - y(d.followers) - margin.bottom)
                .attr('fill', 'steelblue')
                .on('mouseover', (event, d) => {
                    // Display tooltip on mouseover
                    const tooltip = svg.append('g').attr('class', 'tooltip');
                    tooltip
                        .append('text')
                        .attr('x', x(new Date(d.update_date).toISOString().substring(0, 10))! + x.bandwidth() / 2)
                        .attr('y', y(d.followers) - 10)
                        .attr('text-anchor', 'middle')
                        .style('font-size', '12px')
                        .text(`folowers: ${d.followers}`);
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


        }

    }, [chartRef, userAnalytics])

    const getLiveToThatDate = (e: any) => {
        window.alert(e.target.value)
    }

    return (
        <div className='flex w-full h-[25rem]'>
            <div className='flex flex-col h-[93vh] w-[50%] '>
                <div className='bg-[#4B4B4B] w-[27.8rem] mr-auto h-[20rem] mt-[2rem] ml-[2rem]'>
                    <h1 className="text-white self-center ml-[1rem] mt-[1rem] text-lg">Total Views: {userAnalytics?.userAnalyticsData.total_views}</h1>
                    <h1 className="text-white self-center ml-[1rem] mt-[1rem] text-lg">Folowers: {userAnalytics?.userAnalyticsData.followers}</h1>
                    <h1 className="text-white self-center ml-[1rem] mt-[1rem] text-lg">Videos: {userAnalytics?.userAnalyticsData.videos}</h1>
                    {/* <h1 className="text-white self-center ml-[1rem] mt-[1rem] text-lg">Account Created At: </h1> */}
                </div>
                <div id="chart" className='bg-[#4B4B4B] w-[80%]  h-[33rem] mt-[2rem] ml-[2rem]'>
                    <h1 className="text-white self-center ml-[1rem] mt-[1rem] text-sm">Folowers history</h1>

                    <svg ref={chartRef} className='w-full h-full' />
                </div>
            </div>

            <div className='flex flex-col h-[93vh] w-[50%]'>
                <div className='flex'>

                    <input type="date" id="streamDate" className='h-[2rem] w-[20%] bg-[#4B4B4B]  text-white mt-[2rem] ml-[8vw] text-center' onChange={
                        (e) => {
                            getLiveToThatDate(e)
                        }
                    } />
                    <div className='bg-[#4B4B4B] w-[27.8rem] ml-auto h-[20rem] mt-[2rem] mr-[2rem]'>
                        <h1 className="text-white self-center ml-[1rem] mt-[1rem] text-lg">Total Views: {userAnalytics?.userAnalyticsData.total_views}</h1>
                        <h1 className="text-white self-center ml-[1rem] mt-[1rem] text-lg">Folowers: {userAnalytics?.userAnalyticsData.followers}</h1>
                        <h1 className="text-white self-center ml-[1rem] mt-[1rem] text-lg">Videos: {userAnalytics?.userAnalyticsData.videos}</h1>
                        {/* <h1 className="text-white self-center ml-[1rem] mt-[1rem] text-lg">Account Created At: </h1> */}
                    </div>
                </div>
                <div id="chart" className='bg-[#4B4B4B] w-[80%]  h-[33rem] mt-[2rem] mr-[2rem] ml-auto'>
                    <h1 className="text-white self-center ml-[1rem] mt-[1rem] text-sm">Folowers history</h1>

                    {/* <svg ref={chartRef} className='w-full h-full' /> */}
                </div>
            </div>
        </div>
    )
}
