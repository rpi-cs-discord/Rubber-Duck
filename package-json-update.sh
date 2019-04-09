if diff ./package.json ../package.json; then
    echo Success;
else
    echo Fail
    cp ./package.json ../package.json
fi
