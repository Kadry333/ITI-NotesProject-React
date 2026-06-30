// import { useState, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import toast from "react-hot-toast";

// import SidebarLayout from "../components/SidebarLayout";
// import { setCredentials } from "../redux/authSlice";
// import { FiUser, FiMail, FiCalendar, FiCamera, FiCheckCircle } from "react-icons/fi";

// const profileSchema = z.object({
//   name: z.string().min(3, "Name must be at least 3 characters"),
//   email: z.string().email("Please enter a valid email"),
// });

// function Profile() {
//   const dispatch = useDispatch();
//   const fileInputRef = useRef(null);

//   const { user, token } = useSelector((state) => state.auth);
//   const [profileImage, setProfileImage] = useState(user?.profileImage || "/images/default.png");
//   const [isSaving, setIsSaving] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(profileSchema),
//     defaultValues: {
//       name: user?.name || "",
//       email: user?.email || "",
//     },
//   });

//   const getInitials = (name) => {
//     if (!name) return "U";
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .substring(0, 2);
//   };

//   const handleAvatarClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 2 * 1024 * 1024) {
//         toast.error("Image size must be less than 2MB");
//         return;
//       }

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const base64String = reader.result;
//         setProfileImage(base64String);
        
//         // Immediately sync locally so the sidebar/avatar updates
//         const updatedUser = { ...user, profileImage: base64String };
//         dispatch(setCredentials({ user: updatedUser, token }));
//         toast.success("Profile picture updated locally!");
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const onSubmit = async (data) => {
//     setIsSaving(true);
    
//     // Simulate API call delay
//     setTimeout(() => {
//       const updatedUser = {
//         ...user,
//         name: data.name,
//         email: data.email,
//         profileImage,
//       };

//       dispatch(
//         setCredentials({
//           user: updatedUser,
//           token,
//         })
//       );
      
//       setIsSaving(false);
//       toast.success("Profile details saved successfully!");
//     }, 800);
//   };

//   const formatJoinedDate = (dateString) => {
//     if (!dateString) return "June 2026";
//     const date = new Date(dateString);
//     return date.toLocaleDateString(undefined, {
//       month: "long",
//       year: "numeric",
//     });
//   };

//   return (
//     <SidebarLayout>
//       <div className="space-y-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 transition-colors">
//             Profile Settings
//           </h1>
//           <p className="mt-1 text-sm text-slate-550 dark:text-slate-400">
//             Manage your user avatar, display profile, and personal details.
//           </p>
//         </div>

//         <div className="grid gap-6 md:grid-cols-3">
//           {/* Left Column: Avatar display and status card */}
//           <div className="md:col-span-1 rounded-3xl border border-slate-200/50 dark:border-slate-850/60 bg-white dark:bg-slate-900 p-6 text-center shadow-sm transition-colors">
            
//             {/* Interactive Avatar Container */}
//             <div className="relative mx-auto h-32 w-32 group">
//               <div 
//                 onClick={handleAvatarClick}
//                 className="relative h-full w-full rounded-3xl overflow-hidden bg-indigo-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 flex items-center justify-center cursor-pointer shadow-inner"
//               >
//                 {profileImage && profileImage !== "/images/default.png" ? (
//                   <img
//                     src={profileImage}
//                     alt={user?.name}
//                     className="h-full w-full object-cover"
//                   />
//                 ) : (
//                   <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
//                     {getInitials(user?.name)}
//                   </span>
//                 )}
                
//                 {/* Camera Overlay on hover */}
//                 <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                   <FiCamera className="h-6 w-6 text-white" />
//                 </div>
//               </div>
              
//               {/* Floating Camera Button on Mobile */}
//               <button 
//                 onClick={handleAvatarClick}
//                 className="md:hidden absolute bottom-0 right-0 rounded-xl bg-indigo-600 p-2 text-white shadow-lg cursor-pointer"
//               >
//                 <FiCamera className="h-4 w-4" />
//               </button>
//             </div>
            
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleFileChange}
//               accept="image/*"
//               className="hidden"
//             />

//             {/* User Name & Details */}
//             <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-slate-50 truncate transition-colors">
//               {user?.name || "User"}
//             </h2>
//             <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate mt-1">
//               {user?.email}
//             </p>

//             <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 text-xs font-semibold text-indigo-750 dark:text-indigo-400">
//               <FiCheckCircle className="h-3.5 w-3.5" />
//               Verified Account
//             </div>

//             {/* Joining info */}
//             <div className="mt-8 border-t border-slate-100 dark:border-slate-800/80 pt-6 text-left space-y-4">
//               <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
//                 <FiCalendar className="h-4.5 w-4.5 text-slate-400 dark:text-slate-550 shrink-0" />
//                 <div>
//                   <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Member Since</p>
//                   <p className="mt-0.5 text-slate-700 dark:text-slate-300">
//                     {formatJoinedDate(user?.createdAt)}
//                   </p>
//                 </div>
//               </div>
//             </div>

//           </div>

//           {/* Right Columns: Edit details form */}
//           <div className="md:col-span-2 rounded-3xl border border-slate-200/50 dark:border-slate-850/60 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm transition-colors">
            
//             <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800/80 pb-4 transition-colors">
//               Profile Details
//             </h2>

//             <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
              
//               {/* Full Name Input */}
//               <div>
//                 <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wide uppercase">
//                   <FiUser className="h-3.5 w-3.5" />
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="e.g. John Doe"
//                   {...register("name")}
//                   className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50/30 dark:bg-slate-950/40 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
//                 />
//                 {errors.name && (
//                   <p className="mt-1.5 text-xs text-red-550 dark:text-red-400 font-medium">
//                     {errors.name.message}
//                   </p>
//                 )}
//               </div>

//               {/* Email Input */}
//               <div>
//                 <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wide uppercase">
//                   <FiMail className="h-3.5 w-3.5" />
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   placeholder="e.g. john@example.com"
//                   {...register("email")}
//                   className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50/30 dark:bg-slate-950/40 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
//                 />
//                 {errors.email && (
//                   <p className="mt-1.5 text-xs text-red-550 dark:text-red-400 font-medium">
//                     {errors.email.message}
//                   </p>
//                 )}
//               </div>

//               {/* Submit Buttons */}
//               <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 flex justify-end">
//                 <button
//                   disabled={isSaving}
//                   className="inline-flex items-center justify-center rounded-xl bg-indigo-650 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 disabled:opacity-75 transition duration-200 cursor-pointer"
//                 >
//                   {isSaving ? (
//                     <div className="flex items-center gap-2">
//                       <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
//                       <span>Saving changes...</span>
//                     </div>
//                   ) : (
//                     "Save Changes"
//                   )}
//                 </button>
//               </div>

//             </form>

//           </div>
//         </div>

//       </div>
//     </SidebarLayout>
//   );
// }

// export default Profile;