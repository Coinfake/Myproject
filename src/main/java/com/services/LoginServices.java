package com.services;

import com.bean.User;
import com.mapper.LoginMapper;

import javax.annotation.Resource;
import java.util.List;

/**
 * Created by 74642 on 2017/3/11.
 */
public class LoginServices {
    @Resource(name = "Mapper")
    private LoginMapper Mapper;

    public boolean login(User user) {
        List<User> list = Mapper.loginServices(user);
        if (list.size() == 0) {
            return false;
        } else {
            return true;
        }
    }

    public void register(User user) {
        Mapper.registerServices(user);
    }
}
