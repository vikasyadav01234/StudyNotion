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
    
    if(editSectionName){
      //we are editing the section name
      result =await updateSection(
        {
          sectiomName:data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        }, token
      )
    }
    else {
      result = await createSection({
        sectionName: data.sectionName,
        courseId: course._id,
      },token)
    }

    //update values
    if(result) {
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName", "");
    }

    //loading false
    setLoading(false);
  }

  const cancelEdit = () =>{
    setEditSectionName(null);
    setValue("sectionName", "");
  }

  const goBack=()=>{
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  }

  const goToNext = () =>{
    if(course?.courseContent?.length ===0){
      toast.error("Please add at least one section");
      return;
    }
    if(course.courseContent.some((section)=>section.subSection.length === 0)){
      toast.error("Please add atleast one lecture in each section");
      return;
    }
    //if everything is good
    dispatch(setStep(3));
  }

  const handleChangeEditSectionName = (sectionId, sectionName)=>{
    if(editSectionName === sectionId){
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  }
  return (
    <div className='text-white'>
      Step 2 me aapka swagat h 
    </div>
  )
}

export default CourseBuilderForm