package com.mapper;

import com.bean.User;

import java.util.List;

/**
 * Created by 74642 on 2017/3/11.
 */
public interface LoginMapper {
    public List<User> loginServices(User user);
    public void registerServices(User user);
}
