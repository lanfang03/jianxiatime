var express = require('express');
var router = express.Router();
// 1.引入用户模型
var model = require('../tools/model');
var User = model.User;

// 注册
router.get('/register', function(req, res, next) {
    res.render('users/register');
});
router.post('/create',function(req,res){
	// 接收用户数据，处理之后再保存到数据库
	// 处理数据（密码加密）
	var tool = require('../tools/md5.js');
	req.body.password = tool.md5(req.body.password);
	User.create(req.body,function(err,data){
		if(err){
			// console.log(err);
			res.redirect('back');
		}else{
			// console.log(data);
			req.session.admin = data;
			res.redirect('/');
		}
	})
})
router.get('/',function(req,res){
	User.findOne(function(err,data){
		if(err){
			res.end('查询出现错误');
		}else{
			res.render('/')
		}
	})
})


// 登录
router.get('/login', function(req, res, next) {
    res.render('users/login',{error:req.flash('error').toString()});
});

// 检验登录页面
router.post('/login',function(req,res){
	// 接收用户的信息并做检验
	// 引入加密模块
	var tool = require('../tools/md5.js');
	req.body.password = tool.md5(req.body.password);
	console.log(req.body);
	User.findOne(req.body,function(err,data){
		if(err){
			res.end('查询出错啦');
		}else{
			if(data == null){
				// 查询成功，但是没有数据，返回上一个页面重新写入数据
				// 用户名和密码出错
				req.flash('error','用户名密码错误');
				res.redirect('back');
			}else{
				// 网站中需要使用session判断用户的相关信息，所以将信息存储到session中
				req.flash('success','登录成功');
				req.session.admin = data;
				res.redirect('/');
			}
		}
	})
})


// 修改
router.get('/update/:_id', function(req, res, next) {
    // res.render('users/update');
    User.findOne({_id:req.params._id},function(err,data){
    	if(err){
    		res.end('查询失败');
    	}else{
    		res.render('users/update',{data:data});
    		// console.log(data);
    	}
    })
});
// 执行用户修改操作
router.post('/update',function(req,res){
	User.update({_id:req.body._id},{$set:req.body},function(err,data){
		if(err){
			res.redirect('back');
		}else{
			// console.log(data);
			// res.render('/',{admin:req.session.admin});
			res.redirect('/');
		}
	})
})









module.exports = router;
