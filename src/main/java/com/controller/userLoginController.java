package com.controller;


import com.bean.User;
import com.services.LoginServices;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;


@Controller
public class userLoginController {
    @Resource(name = "loginService")
    private LoginServices loginServices;

    @RequestMapping(value = "/api/json/admin/LoginServices", method = RequestMethod.POST, produces = "application/json;charset=utf-8")
    @ResponseBody
        public User login(@RequestParam("username") String username,
                             @RequestParam("password") String password,
                            @RequestParam("status") int status) {
                        User user = new User();
                        user.setUsername(username);
                        user.setPassword(password);
                        user.setStatus(status);
                        Boolean flag = loginServices.login(user);
                        if (flag == true) {
                                user.setSuccess(true);
                                return user;
                        } else {
                                user.setSuccess(false);
                                return user;
                        }
        }

    @RequestMapping(value = "/api/json/admin/RegisterServices", method = RequestMethod.POST, produces = "application/json;charset=utf-8")
    @ResponseBody
    public User register(@RequestParam("username") String username,
                         @RequestParam("password") String password,
                         @RequestParam("sex") String sex,
                         @RequestParam("phoneNum") int phoneNum,
                         @RequestParam("email") String email,
                         @RequestParam("address") String address) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setSex(sex);
        user.setPhoneNum(phoneNum);
        user.setAddress(address);
        user.setEmail(email);
        loginServices.register(user);
        user.setSuccess(true);
        return user;
    }
}