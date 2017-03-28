package com.tools;

/**
 * Created by 74642 on 2017/3/5.
 */
public class DefaultMessage {
    public static final String CODE_SUCCESS = "SUCCESS";
    public static final String CODE_FAILED = "FAILED";

    // 系统相关错误码
    private String success;
    private Object otherobject;
    private Object message;

    public DefaultMessage(String success,Object message){
        this.success = success;
        this.message =message;
        this.otherobject = "";
    }
}
