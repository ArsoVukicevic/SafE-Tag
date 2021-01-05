# safetag-database

This project contains safetag liquibase scripts

###Run liquibase locally

1. Download liquibase jar (https://download.liquibase.org/download-community/)
1. Be sure to have postgres drivers in your classpath. If not:
    1. Download the postgres jdbc driver (https://search.maven.org/search?q=g:org.postgresql)
    1. Place the jar in `lib` folder inside liquibase install folder
1. Add liquibase folder to your `PATH` env variable.
    
1. From the `safetag/backend` folder run:
    - `liquibase --changeLogFile=changelog.xml --defaultsFile=liquibase-dev.properties updateSQL` to review changes before applying them
    - `liquibase --changeLogFile=changelog.xml --defaultsFile=liquibase-dev.properties update` to apply the changes
