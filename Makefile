SRC_DIR = src
FILES = ${SRC_DIR}/api.js ${SRC_DIR}/trap.js ${SRC_DIR}/typechecker.js ${SRC_DIR}/all.js

CONCAT_FILE = struct.js
MINIFY_FILE = struct.min.js

default_target: all

TARGET = clean concat minify

all: $(TARGET)

setup_build_environment:
	@echo "** Pull node_modules for building script"
	git submodule init
	git submodule update
	@cd build; npm install optimist
	@cd build; npm install mu2

setup_test_environment: setup_build_environment
	@echo "** Pull node_modules for test runner"
	# TODO

clean:
	@echo "** Start clean generated files"
	@if [ -f ${CONCAT_FILE} ] ; then echo "rm ${CONCAT_FILE}" ; rm -f ${CONCAT_FILE} ; fi
	@if [ -f ${MINIFY_FILE} ] ; then echo "rm ${MINIFY_FILE}" ; rm -f ${MINIFY_FILE} ; fi

concat: clean ${FILES}
	@echo "** Start concat source files"
	build/concat.js > ${CONCAT_FILE}
	@sleep 0.1

check: concat
	@echo "** Start check source files by jshint"
	build/check.js < ${CONCAT_FILE}

minify: check
	@echo "** Start minify concat file"
	build/node_modules/uglify-js/bin/uglifyjs --unsafe ${CONCAT_FILE} > ${MINIFY_FILE}
	@echo "Created ${MINIFY_FILE}"

test: concat
	@echo "** Start tests"
	@echo "Currently test runner is a simple html file. (placed test/spec_runner.html)"
	# TODO use jasmine tool, to launch from ci tool


