var express = require('express');
var router = express.Router();

/* GET home page. */


var fs =require('fs')
const {colors} = require("debug");
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express',message :'' });
});
router.get('/hotview', function(req, res, next) {
  var name ="Toai Le"
  var tuoi =25
  var array=[1,2,3,4,5,6,7,8,9,10]
  var sinhVien={name : "ToaiLe",sdt :25}
  var danhSach=[
    {name : "ToaiLe",sdt :25},
    {name : "ToaiLe",sdt :25},
    {name : "ToaiLe",sdt :25},
    {name : "ToaiLe",sdt :25}
  ]

  var thongTin={
    name:"ToaiLe",sdt:25,
    danhSach:[
      {name : "ToaiLe",sdt :25},
      {name : "ToaiLe",sdt :25},
      {name : "ToaiLe",sdt :25},
      {name : "ToaiLe",sdt :25}
    ]
  }

  res.render('hot', { title: 'HotView',message :'' ,name : name , a :tuoi,array:array,sinhVien:sinhVien,ds: danhSach,thongTin : thongTin});
});
router.get('/asia', function(req, res, next) {

  fs.readFile('F:\\NodeJS\\lab\\lab2\\data.txt',[],function (err,data) {
    if (err) throw err

    var array=[]
    const databases=JSON.parse(data)

    databases.forEach(db=>{
      console.log(`${db.url}`)
      array.push(`${db.url}`)
    })






    res.render('asia', { title: 'Asia',message :'',data: array });
  })

});
router.get('/euro', function(req, res, next) {
  res.render('category', { title: 'Euro' ,message :''});
});




router.get('/america', function(req, res, next) {
  res.render('category', { title: 'America',message :'' });
});
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About' ,message :''});
});
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About',message :'' });
});




router.post('/hotro', function (request,response){
  var email=request.body.email
  var sdt =request.body.sdt
  var noidung=request.body.noidung

  fs.appendFile('uploads/'+email +'.append',noidung + sdt,function (error){
    var message1=''
    if (error){
      message1 = error
    }else {
      message1 = 'ok,chung toi da nhan thong tin'
    }
    response.render('about' ,{title: 'OK',message : message1 })
  })



});
var dbb='mongodb+srv://admin:tl126998t@cluster0.pc7zi.mongodb.net/mydata?retryWrites=true&w=majority'
const mongoose = require('mongoose');
mongoose.connect(dbb).catch(error => {
  console.log("co loi xay ra "+error)
});
router.get('/cars', function(req, res, next) {
  res.render('cars', { title: 'Cars' ,message :''});
});
//b1 tao khung Schena
var anhSchena = new mongoose.Schema({
  tenAnh:'string',
  noiDung:'string',
  linkAnh:'string'
})
//b2 lien ket Schema voi mongoDB qua mongoose
var Anh = mongoose.model('anh',anhSchena);

router.post('/addCar', function(req, res, next) {
  var tenAnh=req.body.tenAnh
  var noiDung=req.body.noiDung
  var linkAnh=req.body.linkAnh
  //b3khoi tao oto voi gia tri lay dc
  const anh=new Anh({
    tenAnh: tenAnh,
    noiDung: noiDung,
    linkAnh: linkAnh
  })



  anh.save(function (error){
    var mess;
    if (error==null){
      mess='Them thanh cong'
    }else {
      mess=error;
    }
    console.log(error)
    res.render('cars', { title: 'Cars' ,message :''});
  })



});
router.get('/listAnh', function(req, res, next) {
  var danhSach= Anh.find({},function (err,data){
    console.log(err)


    res.render('listAnh', { title: 'About',message :'' ,data : data});
  })

});
router.post('/deleteCar', function(req, res, next) {
  console.log(req.body.__id)
  Anh.deleteOne({_id: req.body.__id}, function (err) {
    if (err == null){
      mess = "Xóa thành công!"
    }else {
      mess = err
    }
  })
  var danhSach= Anh.find({},function (err,data){
    console.log(err)


    res.render('listAnh', { title: 'About',message :'' ,data : data});
  })

});
router.post('/editAnh', function(req, res, next) {
  var anhEdit={
    id :req.body.__id,
    tenAnh : req.body.__tenAnh,
    noiDung : req.body.__noiDung,
    linkAnh : req.body.__linkAnh
  }
    res.render('editAnh', { title: 'About',message :'' ,data : anhEdit});

});
router.post('/editAnhdone', function(req, res, next) {
  Anh.updateOne({_id:req.body.idAnhEdit},{tenAnh: req.body.tenAnhEdit , noiDung : req.body.noiDungEdit , linkAnh : req.body.linkAnhEdit},function (error){
    var danhSach= Anh.find({},function (err,data){
      console.log(err)


      res.render('listAnh', { title: 'About',message :'' ,data : data});
    })
  })

});


// upload file--------------------------------------------------

var multer = require('multer');
// var upload = multer({ dest: 'uploads/' });

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    var random=Math.random();
    cb(null,random+Date.now()+ file.originalname );
  },
});
var imageFilter = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg)/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(new Error('Only image files type JPG are allowed!'), false);
  }
  cb(null, true);
};

var upload = multer({ storage: storage ,fileFilter: imageFilter,limits:{
  fileSize : 2*1024*1024,   //gioi han dung luong file up len 2M

  } }).array("avatar",5);



router.get('/upload', function(req, res, next) {
  res.render('upload', { title: 'Upload',message :'' });
});
router.post('/upload', function(req, res, next) {
  upload(req,res,function (err){
    if ((err)){
      res.render('upload',{message : err.message})
    }
    else {
      res.render('upload',{message : "Upload File thành công!"})
    }
  })


});




module.exports = router;
