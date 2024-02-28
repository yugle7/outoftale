onAfterBootstrap((e) => {
    const src = '/Users/gleb/Projects/sveltekit/outoftale/pb/pb_hooks';
    
    const count = new Array(2000).fill(0);
    {
        const collection = $app.dao().findCollectionByNameOrId("users");
        const data = require(src + '/users.json')
        
        for (const d of data) {
            d.password = d.passwordConfirm = '12345678';
            d.email = d.username + '@outoftale.ru';
            
            count[d.rating]++;

            try {
                const record = new Record(collection)
                const form = new RecordUpsertForm($app, record)
                form.loadData(d)
                form.submit()
            } catch (err) {
                console.log(JSON.stringify(d));
                console.log(err.message);
            }
        }
    }
    {
        const collection = $app.dao().findCollectionByNameOrId('positions');

        let users = 1;
        $app.dao().runInTransaction((txDao) => {
            for (let r = count.length - 1; r >= 0; r--) {
                try {
                    const record = new Record(collection, { id: String(r).padStart('0', 15), users: users });
                    txDao.saveRecord(record);
                } catch (err) {
                    console.log(err.message);
                }
                users += count[r];
            }
        });
    }
    for (let key of ["discussions", "problems"]) {
        console.log(key);

        const collection = $app.dao().findCollectionByNameOrId(key);
        const data = require(`${src}/${key}.json`);

        $app.dao().runInTransaction((txDao) => {
            for (const d of data) {
                try {
                    const record = new Record(collection, d);
                    txDao.saveRecord(record);
                } catch (err) {
                    console.log(JSON.stringify(d));
                    console.log(err.message);
                }
            }
        });
    }
})
