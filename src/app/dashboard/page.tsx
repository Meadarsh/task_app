"use client"
import api from '@/lib/api'
import React, { useEffect, useState } from 'react'
import { TaskStatusChart } from './components/statusChart'
import { TaskPriorityChart } from './components/priorityChart'

const Page = () => {
    const [data,setData]=useState<any>()
    const getDashboardData = async()=>{
        try {
            const res =await api.get("/dashboard")
            setData(res.data)
        } catch (error) {
          console.log(error);
        }
    }
    useEffect(()=>{
        getDashboardData()
    },[])
    return (
    <div className='flex gap-5 h-full pt-16 flex-col px-4 lg:flex-row w-full justify-center'>
<TaskStatusChart data={data?.statusData||[]} totalTasks={data?.totalTasks} />
<TaskPriorityChart data={data?.priorityData||[]}/>
    </div>
  )
}

export default Page