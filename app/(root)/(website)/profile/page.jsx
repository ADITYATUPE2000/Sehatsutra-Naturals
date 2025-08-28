'use client'
import ButtonLoading from '@/components/Application/ButtonLoading'
import UserPanelLayout from '@/components/website/UserPanelLayout'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import useFetch from '@/hooks/useFetch'
import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Dropzone from 'react-dropzone' 
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import userIcon from '@/assets/images/user.png'
import { FaCamera } from "react-icons/fa"
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import { login } from '@/store/reducer/authReducer'


const Profile = () => {
  const dispatch = useDispatch()
  const { data: user } = useFetch('api/profile/get')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState()
  const [file, setFile] = useState()
  
  const formSchema = zSchema.pick({
    name: true, 
    phone: true, 
    address: true
  })
      
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: ""
    }
  })

  useEffect(() => {
    if (user && user.success) {
      const userData = user.data
      form.reset({
        name: userData?.name || "",
        phone: userData?.phone || "",
        address: userData?.address || ""
      })

      setPreview(userData?.avatar?.url)
    }
  }, [user, form])

  const handleFileSelection = (files) => {
    const selectedFile = files[0]
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile)
      setPreview(previewUrl)
      setFile(selectedFile)
    }
  }

  const updateProfile = async (values) => {
    setLoading(true)
    try {
      let formData = new FormData()
      if (file) {
        formData.set('file', file)
      }
      formData.set('name', values.name)
      formData.set('phone', values.phone)
      formData.set('address', values.address)

      const { data: response } = await axios.put('/api/profile/update', formData)
      if (!response.success) {
        throw new Error(response.message)
      }

      showToastt('success', response.message)
      dispatch(loginn(response.data))

    } catch (error) {
      showToast('error', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <UserPanelLayout>
        <div className='shadow rounded bg-white'>
          <div className='p-5 text-xl font-semibold border-b'>
            Profile
          </div>

          <div className='p-5'>
            <Form {...form}>
              <form className='grid md:grid-cols-2 grid-cols-1 gap-5' onSubmit={form.handleSubmit(updateProfile)}>
                
                {/* Avatar Upload Section */}
                <div className='md:col-span-2 col-span-1 flex justify-center items-center mb-5'>
                  <Dropzone 
                    onDrop={acceptedFiles => handleFileSelection(acceptedFiles)}
                    accept={{
                      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
                    }}
                    multiple={false}
                  >
                    {({getRootProps, getInputProps}) => (
                      <div {...getRootProps()} className='relative cursor-pointer group'>
                        <input {...getInputProps()} />
                        <Avatar className='w-28 h-28 border-2 border-gray-200'>
                          <AvatarImage src={preview || userIcon.src} alt="Profile Avatar" />
                        </Avatar>
                        <div className='absolute inset-0 flex justify-center items-center border-2 border-violet-500 rounded-full group-hover:flex hidden cursor-pointer bg-black/50'>
                          <FaCamera color='#7c3aed' size={20} />
                        </div>
                      </div>
                    )}
                  </Dropzone>
                </div>

                {/* Name Field */}
                <div className='mb-3'>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input 
                            type="text" 
                            placeholder="Enter your name" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Phone Field */}
                <div className='mb-3'>
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input 
                            type="tel" 
                            placeholder="Enter your phone number" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Address Field */}
                <div className='mb-3 md:col-span-2 col-span-1'>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter your address" 
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <div className='mb-3 md:col-span-2 col-span-1'>
                  <ButtonLoading 
                    loading={loading} 
                    type="submit" 
                    text="Save Changes" 
                    className='w-full md:w-auto px-6 py-2'
                  />
                </div>
                
              </form>
            </Form>
          </div>
        </div>
      </UserPanelLayout>
    </div>
  )
}

export default Profile