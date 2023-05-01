FROM python

COPY . .

RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["python", "-m", "flask", "--app", "app.py", "run", "--host=0.0.0.0"]