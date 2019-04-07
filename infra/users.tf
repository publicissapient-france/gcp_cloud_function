variable "projects" {
  type = "list"

  default = [
    "black-955",
    "blue-478",
    "green-213",
    "grey-691",
    "orange-779",
    "pink-338",
    "purple-317",
    "red-294",
    "white-627",
    "yellow-986",
  ]
}

variable "users" {
  type = "map"

  default = {
    "0" = ["user:jbclaramonte@xebia.fr", "user:ndechandon@xebia.Fr"]
    "1" = ["user:jbclaramonte@xebia.fr", "user:ndechandon@xebia.Fr"]
    "2" = ["user:jbclaramonte@xebia.fr", "user:ndechandon@xebia.Fr"]
    "3" = ["user:jbclaramonte@xebia.fr", "user:ndechandon@xebia.Fr"]
    "4" = ["user:jbclaramonte@xebia.fr", "user:ndechandon@xebia.Fr"]
    "5" = ["user:jbclaramonte@xebia.fr", "user:ndechandon@xebia.Fr"]
    "6" = ["user:jbclaramonte@xebia.fr", "user:ndechandon@xebia.Fr"]
    "7" = ["user:jbclaramonte@xebia.fr", "user:ndechandon@xebia.Fr"]
    "8" = ["user:jbclaramonte@xebia.fr", "user:ndechandon@xebia.Fr"]
    "9" = ["user:jbclaramonte@xebia.fr", "user:ndechandon@xebia.Fr"]
  }
}

variable "date" {
  type    = "string"
  default = "2018-11-14"
}
