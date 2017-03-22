// 1.引入mongoose
var mongoose = require('mongoose');

// 2.连接Mongodb
mongoose.connect('mongodb://localhost:27017/jianxia');

// 3.创建模型
var User = mongoose.model('User', { username: String, password: String, img: String,phone: Number, addtime: { type: Date, default: new Date() },  ip: String });
var Shop = mongoose.model('Shop', { username: String,title: String, other: String});
// 4.导出模块
exports.User = User;
exports.Shop = Shop;




/*// 1.引入用户模型
var model = require('../tools/model');
var User = model.User;*/