# CALLHOME NODEJS

## Usage

1. `nvm use`
2. `npm install`
3. `API_KEY=xxxxxxx PORT=4444 npm start`

   API_KEY could be override using this env variable. But we recommend to use (node-config)[https://github.com/lorenwest/node-config#quick-start]

## Docs

> GET
>  /get-treatment
>
> QUERY PARAMS
>  key:
>    This is the key used in the getTreatment call.
>  bucketing-key:
>    (Optional) This is the bucketing key used in the getTreatment call.
>  split-name:
>    This should be the name of the split you want to include in the getTreatment call.
>  attributes:
>    (Optional) This should be a json string of the attributes you want to include in the getTreatment call.
>
> EXAMPLE
>  curl 'http://localhost:4444/get-treatment?key=my-customer-key&split=my-experiment'


> GET
>   /get-treatments
>
> QUERY PARAMS
>   key:
>     This is the key used in the getTreatments call.
>   bucketing-key:
>     (Optional) This is the bucketing key used in the getTreatments call.
>   split-names:
>     List of comman-separated splits you want to include in the getTreatments call.
>   attributes:
>     (Optional) This should be a json string of the attributes you want to include in the getTreatments call.
>
> EXAMPLE
>   curl 'http://localhost:4444/get-treatments?key=my-customer-key&split-names=my-experiment,another-experiment'
