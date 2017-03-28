
  package com.bean;

    public class User {
      private String username;
      private int id;
      private String password;
      private String sex;
      private int phoneNum;
      private String address;
      private String email;
      private int status;

      public int getStatus() {
        return status;
      }

      public void setStatus(int status) {
        this.status = status;
      }



      public String getEmail() {
        return email;
      }

      public void setEmail(String email) {
        this.email = email;
      }

    public String getSex() {
      return sex;
    }

    public void setSex(String sex) {
      this.sex = sex;
    }

    public int getPhoneNum() {
      return phoneNum;
    }

    public void setPhoneNum(int phoneNum) {
      this.phoneNum = phoneNum;
    }

    public String getAddress() {
      return address;
    }

    public void setAddress(String address) {
      this.address = address;
    }

    public boolean isSuccess() {
      return success;
    }

    public void setSuccess(boolean success) {
      this.success = success;
    }

    private boolean success;
  public User()
  {
  }
  public User(String userName,String password)
  {
    this.username=username;
    this.password=password;
  }

  public String getPassword() {
	return password;
  }
  public void setPassword(String password) {
	this.password = password;
  }
  public String getUsername() {
	return username;
  }
  public void setUsername(String username) {
	this.username = username;
  }
  public int getId() {
	return id;
  }
  public void setId(int id) {
	this.id = id;
  }
  
   }
