// rendering --
exports.loginScreen= (req,res)=>{
    res.status(200).json({
      status:"success",
      message:"login screen"
    })
    // res.render('loginPage')
}
exports.signupScreen= (req,res)=>{
  res.status(200).json({
    status:"success",
    message:"signup screen"
  })  
  // res.render('signupPage')
}

exports.home= (req,res)=>{
  res.render('home')
}

exports.dashBoard= (req,res)=>{
  res.render('dashboard')
}

exports.signup= (req,res)=>{
  res.render('signup')
}

exports.allEmployess= async (req,res)=>{
  try{
    // const userId = req.userr._id
    // const shp = await Userr.findById(userId);
    // if(!shp){
    //   return res.status(404).send('user not found');
    // }
    res.render('employees')
  }catch(err){
    console.log(err)
  }
}




exports.allVendors= async (req,res)=>{
  try{
    // const userId = req.userr._id
    // const shp = await Userr.findById(userId);
    // if(!shp){
    //   return res.status(404).send('user not found');
    // }
    res.render('vendor')
  }catch(err){
    console.log(err)
  }
}

exports.viewEmployee= async (req,res)=>{
  try{
    // const employeeId = req.params.employeeId
 
    //  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    //   // Invalid userId format
    //   return res.status(400).send('employee not found');
    // }
   
    // const emp = await Employee.findById(employeeId);
    // if(!emp){
    //   return res.status(404).send('Employee not found');
    // }
    res.render('viewEmployee')
  }catch(err){
    console.log(err)
  }
}

exports.viewVendors= async (req,res)=>{
  try{

    // const vendorId = req.params.vendorId

    //  if (!mongoose.Types.ObjectId.isValid(vendorId)) {
    //   // Invalid userId format
    //   return res.status(400).send('vendor not found');
    // }

    // const emp = await Vendor.findById(vendorId);
    // if(!emp){
    //   return res.status(404).send('Shop or Vendor not found');
    // }
    res.render('viewVendor')
  }catch(err){
    console.log(err)
  }
}

exports.shop= async(req,res)=>{
  try{
    // const shopId = req.params.shopId;
 
    // if (!mongoose.Types.ObjectId.isValid(shopId)) {
    //   // Invalid userId format
    //   return res.status(400).send('Shop not found');
    // }

    // const shp = await Shop.findById(shopId);

    // if(!shp){
    //   return res.status(404).send('Shop not found');
    // }
    res.render('shop')
  }catch(err){
    console.log(err)
  }
  
}


