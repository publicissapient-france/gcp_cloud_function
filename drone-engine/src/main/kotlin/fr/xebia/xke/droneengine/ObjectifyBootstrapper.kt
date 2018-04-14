package fr.xebia.xke.droneengine

import com.googlecode.objectify.ObjectifyService
import javax.servlet.ServletContextEvent
import javax.servlet.ServletContextListener

class ObjectifyBootStrapper : ServletContextListener {
    override fun contextInitialized(sce: ServletContextEvent?) {
        ObjectifyService.init()
        ObjectifyService.register(Person::class.java)
    }


    override fun contextDestroyed(sce: ServletContextEvent?) {
    }
}