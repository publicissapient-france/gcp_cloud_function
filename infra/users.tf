variable "projects"{
  type = "list"
default =[
  "black-602",
  "blue-768",
  "green-198",
  "grey-571",
  "orange-81",
  "pink-719",
  "purple-629",
  "red-130",
  "white-560",
  "yellow-679"
  ]
}

variable "users" {
  type = "map"
  default = {
    "0"= ["user:jbclaramonte@xebia.fr", "user:ndechandon@xebia.Fr"]
    "1"= ["user:jbclaramonte@xebia.fr", "user:ndechandon@xebia.Fr"]
    "2"= ["user:jbclaramonte@xebia.fr", "user:ndechandon@xebia.Fr"]
    "3"= ["user:jbclaramonte@xebia.fr", "user:ndechandon@xebia.Fr"]
    "4"= ["user:jbclaramonte@xebia.fr", "user:ndechandon@xebia.Fr"]
    "5"= ["user:jbclaramonte@xebia.fr", "user:ndechandon@xebia.Fr"]
    "6"= ["user:jbclaramonte@xebia.fr", "user:ndechandon@xebia.Fr"]
    "7"= ["user:jbclaramonte@xebia.fr", "user:ndechandon@xebia.Fr"]
    "8"= ["user:jbclaramonte@xebia.fr", "user:ndechandon@xebia.Fr"]
    "9"= ["user:jbclaramonte@xebia.fr", "user:ndechandon@xebia.Fr"]
  }
}

variable "date" {
  type = "string"
  default = "2018-11-14"
}







