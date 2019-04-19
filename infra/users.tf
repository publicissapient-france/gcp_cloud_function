variable "projects"{
  type = "map"

default = {
  "0" ="amber-130",
  "1" ="black-545",
  "2" ="blue-206",
  "3" ="brown-295",
  "4" ="cyan-653",
  "5" ="green-472",
  "6" ="grey-608",
  "7" ="lemon-764",
  "8" ="lime-314",
  "9" ="magenta-78",
  "10" ="marin-745",
  "11" ="orange-940",
  "12" ="pink-203",
  "13" ="purple-395",
  "14" ="red-64",
  "15" ="rubi-232",
  "16" ="teal-138",
  "17" ="violet-690",
  "18" ="white-641",
  "19" ="yellow-596"
}
}

variable "users" {
  type = "map"
  default = {
    "0"= ["user:ndechandon@gmail.com"]
    "1"= ["user:ndechandon@gmail.com"]
    "2"= ["user:ndechandon@gmail.com"]
    "3"= ["user:ndechandon@gmail.com"]
    "4"= ["user:ndechandon@gmail.com"]
    "5"= ["user:ndechandon@gmail.com"]
    "6"= ["user:ndechandon@gmail.com"]
    "7"= ["user:ndechandon@gmail.com"]
    "8"= ["user:ndechandon@gmail.com"]
    "9"= ["user:ndechandon@gmail.com"]
    "9"= ["user:ndechandon@gmail.com"]
    "10"= ["user:ndechandon@gmail.com"]
    "11"= ["user:ndechandon@gmail.com"]
    "12"= ["user:ndechandon@gmail.com"]
    "13"= ["user:ndechandon@gmail.com"]
    "14"= ["user:ndechandon@gmail.com"]
    "15"= ["user:ndechandon@gmail.com"]
    "16"= ["user:ndechandon@gmail.com"]
    "17"= ["user:ndechandon@gmail.com"]
    "18"= ["user:ndechandon@gmail.com"]
    "19"= ["user:ndechandon@gmail.com"]
  }
}

variable "date" {
  type = "string"
  default = "2019-03-19"
}







