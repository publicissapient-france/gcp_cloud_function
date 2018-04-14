package fr.xebia.xke.droneengine

import com.googlecode.objectify.ObjectifyService
import com.googlecode.objectify.annotation.Entity
import com.googlecode.objectify.annotation.Id
import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.features.ContentNegotiation
import io.ktor.html.respondHtml
import io.ktor.http.HttpStatusCode
import io.ktor.jackson.jackson
import io.ktor.response.respond
import io.ktor.routing.get
import io.ktor.routing.routing
import kotlinx.html.body
import kotlinx.html.head
import kotlinx.html.p
import kotlinx.html.title
import java.time.Year
import java.util.*

data class Model(val name: String, val items: List<Item>, val yearMonth: Year = Year.now())
data class Item(val key: String, val value: String)

@Entity
data class Person(
    @Id
    val id : Long = Random(System.currentTimeMillis()).nextLong(),
    var name: String? = ""
)

fun Application.main() {
    install(ContentNegotiation) {
        jackson {
            // Configure Jackson's ObjectMapper here
        }
    }

    val model = Model("root", listOf(Item("A", "Apache"), Item("B", "Bing")))
    routing {
        get("/") {
            call.respondHtml {
                head {
                    title { +"Ktor: maven-google-appengine-standard" }
                }
                body {
                    p {
                        +"Hello from Ktor Maven Google Appengine Standard sample application"
                    }
                }
            }
        }
        get("/v1") {
            call.respond(model)
        }

        get("/tasks/computeNextDronesLocations") {
            println("... computing next drones locations now")
        }


        get("/v1/item/{key}") {
            val item = model.items.firstOrNull { it.key == call.parameters["key"] }
            if (item == null)
                call.respond(HttpStatusCode.NotFound)
            else
                call.respond(item)
        }


        get("/save/{name}") {
            val person = Person(name = call.parameters["name"])
            ObjectifyService.ofy().save().entity(person)
            call.respond(person)
        }

        get("/load") {
            val list = ObjectifyService.ofy().load().type(Person::class.java).list()
            call.respond(list)
        }
    }
}