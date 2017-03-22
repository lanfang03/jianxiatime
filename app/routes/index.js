var express = require('express');
var router = express.Router();
// 1.引入用户模型
var model = require('../tools/model');
var User = model.User;
var Shop = model.Shop;
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
    

});

router.get('/index', function(req, res, next) {
    // res.render('jianxia');
    // console.log(req.session.admin);
    Shop.find(function(err,data){
        if(err){
            res.end('error');
        }else{
            // var data = res.json(data);
            res.render('jianxia',{data:data});
            // console.log(req.session.admin);
        }
    })
    
});
// 写作
router.get('/write/:_id', function(req, res, next) {
    res.render('write');
});
// 提交内容到数据库jianxia->shop
router.post('/write',function(req,res){

    req.body.username = req.session.admin.username;

    // console.log(req.body);
	Shop.create(req.body,function(err,data){
        if(err){
            res.redirect('back');
        }else{
            res.redirect('/');
        }

	})
})
/*router.get('/one',function(req,res){

})*/

router.get('/mine', function(req, res, next) {
    res.render('mine',{admin:req.session.admin});
});
module.exports = router;
// 退出-删除session信息
router.get('/logout',function(req,res){
    // 删除admin的信息
    req.session.admin = null;

    res.redirect('/');
})