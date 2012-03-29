SRC_DIR = src
FILES = ${SRC_DIR}/api.js ${SRC_DIR}/trap.js ${SRC_DIR}/typechecker.js template.js

default_target: all

TARGET = clean concat minify test

all: $(TARGET)

clean:
	@@echo "Delete generated files"
	#rm struct.js

concat: ${FILES}
	@@echo "Start concat source files"
	node build/concat.js

minify: concat
	@@echo "Start minify concat file"
	# TODO

test: concat
	@@echo "Start tests"
	# TODO use jasmine tool


