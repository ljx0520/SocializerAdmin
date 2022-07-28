FROM python:3.8.3-alpine3.10

ADD ./requirements.txt /socializer_admin/requirements.txt

RUN apk --update add libxml2-dev libxslt-dev libffi-dev gcc musl-dev libgcc openssl-dev curl
RUN apk add jpeg-dev zlib-dev freetype-dev lcms2-dev openjpeg-dev tiff-dev tk-dev tcl-dev
RUN apk --update add python py-pip openssl ca-certificates py-openssl wget
RUN apk --update add --virtual build-dependencies libffi-dev openssl-dev python-dev py-pip build-base \
  && pip install --upgrade pip \
  && pip install -r /socializer_admin/requirements.txt \
  && apk del build-dependencies

ADD . /socializer_admin
WORKDIR /socializer_admin

ENV VIRTUAL_ENV /env
ENV PATH /env/bin:$PATH

EXPOSE 7070

CMD ["gunicorn", "--bind", "0.0.0.0:7070", "--workers", "3", "socializer_admin.wsgi"]