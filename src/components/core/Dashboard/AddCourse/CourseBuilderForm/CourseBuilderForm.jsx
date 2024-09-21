import React,{useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import IconBtn from '../../../../common/IconBtn';
import {MdAddCircleOutline} from "react-icons/bi"
import { BiAddToQueue } from 'react-icons/bi';
import { useDispatch,useSelector } from 'react-redux';
import { BiRightArrow } from 'react-icons/bi';
import {setCourse,setEditCourse,setStep} from '../../../../../slices.courseSlice';
import {toast} from 'react-hot-toast'
import {createSection,updateSection} from '../../../../../services/operations/courseDetailsAPI'

const CourseBuilderForm = () => {

  const {register,handleSubmit,setValue, formState:{errors}}=useForm();
  const [editSectionName,setEditSectionName] = useState(null);
  const {course}=useSelector((state)=>state.course);
  const dispatch=useDispatch();
  const {token} = useSelector((state)=>state.auth);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    console.log("Updated");
  },[course])

  const onSubmit = async(data) =>{
    setLoading(true);
    let result;
  }

  return (
    <div className='text-white'>
      Step 2 me aapka swagat h 
    </div>
  )
}

export default CourseBuilderForm