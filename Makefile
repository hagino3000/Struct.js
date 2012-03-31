JS_ENGINE ?= `which node nodejs 2>/dev/null`

SRC_DIR = src
FILES = ${SRC_DIR}/api.js ${SRC_DIR}/trap.js ${SRC_DIR}/typechecker.js ${SRC_DIR}/all.js

CONCAT_FILE = struct.js
MINIFY_FILE = struct.min.js

default_target: all

TARGET = clean concat minify test

all: $(TARGET)

setup_build_environment:
	@echo "** Pull node_modules for building script"
	git submodule init
	git submodule update

setup_test_environment: setup_build_environment
	@echo "** Pull node_modules for test runner"
	# TODO

clean:
	@echo "** Start clean generated files"
	@if [ -f ${CONCAT_FILE} ] ; then echo "rm ${CONCAT_FILE}" ; rm -f ${CONCAT_FILE} ; fi
	@if [ -f ${MINIFY_FILE} ] ; then echo "rm ${MINIFY_FILE}" ; rm -f ${MINIFY_FILE} ; fi

concat: clean ${FILES}
	@echo "** Start concat source files"
	${JS_ENGINE} build/concat.js
	@sleep 0.1

minify: concat
	@echo "** Start minify concat file"
	${JS_ENGINE} build/node_modules/uglify-js/bin/uglifyjs --unsafe ${CONCAT_FILE} > ${MINIFY_FILE}
	@echo "Created ${MINIFY_FILE}"

test: concat
	@echo "** Start tests"
	# TODO use jasmine tool


