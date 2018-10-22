provider "google" {
  region  = "europe-west1"
  project = "deploy-techevent-drone"
}
terraform {
  backend "gcs" {
    /*
        The configuration is done through partial configuration since backend
        configuration cannot contain variable interpolations and we need
        something that will depend on env
      */
    bucket  = "techevent-drone-tf-state"

  }
}
