FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npx playwright install --with-deps chromium
RUN npm install
COPY . .
ENV DOCURUN_SOURCE_FOLDER=/docurun
CMD ["./bin/docurun.js"]