//const asyncHandler = () => {}
//const asyncHandler = (fun) => { () => {} }
//const asyncHandler = (fun) => async () => {}



const asyncHandler = (requestHandler) => {
   return (req,res,next) =>{
        Promise.resolve(requestHandler(res,req,next)).catch((err) => next(err))
    }
}

export {asyncHandler}

// const asyncHandler = (fn) => async(req,res,next) => {
//     try {
        
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success:false,
//             message: err.message
//         })
        
//     }
// }