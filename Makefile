##########################################################################
## Change macros below according to your environment and your needs
##
## CLASSDIR if you want to compile to a class directory instead of generating
##          a jar, by using the 'test' target, you may set the directory here.
##
## CLASSPATH Specify where to find the servlet library and the java-cup
##           library. For Debian Linux platform you wont need to change
##           this.
##
## JAVAC: Java compiler
## JAR:   Jar archiver
##########################################################################
  CLASSDIR = classes
 CLASSPATH = /usr/share/java/gettext-commons.jar:polaric-aprsd.jar:jcoord.jar:/usr/share/java/tomcat-dbcp.jar:/usr/share/java/postgresql-9.4.1208.jar:/usr/share/java/postgis.jar:simple.jar:tomcat-juli.jar
INSTALLDIR = /etc/polaric-aprsd/plugins
     JAVAC = javac -source 1.8 -target 1.8
       JAR = jar

# Review (and if necessary) change these if you are going to
# install by using this makefile

   INSTALL_JAR = $(DESTDIR)/etc/polaric-aprsd/plugins
   INSTALL_WWW = $(DESTDIR)/etc/polaric-webapp/www/auto
   INSTALL_BIN = $(DESTDIR)/usr/bin
INSTALL_CONFIG = $(DESTDIR)/etc/polaric-aprsd
   INSTALL_LOG = $(DESTDIR)/var/log/polaric
	 INSTALL_PLUGDIR = $(INSTALL_CONFIG)/config.d




##################################################
##  things below should not be changed
##
##################################################
    LIBDIR = _lib
 JAVAFLAGS =
 PACKAGES  = core scala



all: aprs

install: polaric-aprsd.jar
	install -d $(INSTALL_CONFIG)/config.d
	install -d $(INSTALL_BIN)
	install -d $(INSTALL_JAR)
	install -d $(INSTALL_WWW)
	install -m 644 js/database.js $(INSTALL_WWW)
	install -m 644 js/edit.png $(INSTALL_WWW)
	install -m 755 -d $(INSTALL_LOG)
	install -m 644 polaric-db.jar $(INSTALL_JAR)
	install -m 644 db.ini $(INSTALL_CONFIG)/config.d


$(INSTALLDIR)/polaric-db.jar: polaric-db.jar
	cp polaric-db.jar $(INSTALLDIR)/polaric-db.jar


aprs: $(LIBDIR)
	@make TDIR=$(LIBDIR) CLASSPATH=$(LIBDIR):$(CLASSPATH) compile
	cd $(LIBDIR);jar cvf ../polaric-db.jar *;cd ..


compile: $(PACKAGES)


$(CLASSDIR):
	mkdir $(CLASSDIR)


$(LIBDIR):
	mkdir $(LIBDIR)


.PHONY : core
core:
	$(JAVAC) -d $(TDIR) $(JAVAFLAGS) src/*.java


.PHONY : scala
scala:
	scalac -d $(TDIR) -classpath $(LIBDIR):$(CLASSPATH) src/*.scala


clean:
	@if [ -e ${LIBDIR} ]; then \
		  rm -Rf $(LIBDIR); \
	fi
	rm -f ./*~ src/*~
