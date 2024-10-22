import React, { useState } from 'react';
import { app as  storage } from "../../../config/firebaseConfig";
import { ref, getDownloadURL, uploadBytes, uniqueFileName } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import './addProperty.css'
import { useSelector } from 'react-redux';


function AddPropertyForm() {
    const userId = useSelector((state) => state.userId.value);
    console.log(userId)

    const [address, setAddress] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');
    const [contact, setContact] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [beds, setBeds] = useState('');
    const [baths, setBaths] = useState('');
    const [sqft, setSqft] = useState('');
    const [price, setPrice] = useState('');
    const [photos, setPhotos] = useState([]);
    const [description, setDescription] = useState('');
    const [file, setFile] = useState("");
    const [formError, setFormError] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'address':
                setAddress(value);
                break;
            case 'propertyType':
                setPropertyType(value);
                break;
            case 'beds':
                setBeds(value);
                break;
            case 'baths':
                setBaths(value);
                break;
            case 'sqft':
                setSqft(value);
                break;
            case 'price':
                setPrice(value);
                break;
            case 'photos':
                setPhotos(event.target.files);
                break;
            case 'description':
                setDescription(value);
                break;
            case 'state':
                setState(value);
                break;
            case 'city':
                setCity(value);
                break;
            case 'zip':
                setZip(value);
                break;
            case 'contact':
                setContact(value);
                break;
            default:
                break;
        }
    };


    // State to store uploaded file

    // Handle file upload event and update state
    // function handleChange(event) {
    //     setFile(event.target.files);
    //     console.log(file)
    // }

    function handleChange(event) {
        setFile(event.target.files);
    }

    const handleUploadImage = async () => {
        console.log('hello')
        let imgUrl = '';
        console.log(storage)
        const uniqueFileName = `houserentalmanagement/images/${uuidv4()}`;
        console.log("Storage path:", uniqueFileName);  // Log the file path in storage
        const storageRef = ref(storage, uniqueFileName);

        uploadBytes(storageRef, file).then((snapshot) => {
            console.log('Uploaded a blob or file!');
            console.log(snapshot)
            getDownloadURL(snapshot.ref).then((url) => {
                console.log(url);
            });
        });
    }

    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //     console.log(file)
    //     debugger;
    //     if (
    //         address.trim() === '' ||
    //         propertyType.trim() === '' ||
    //         beds.trim() === '' ||
    //         baths.trim() === '' ||
    //         sqft.trim() === '' ||
    //         price.trim() === '' ||
    //         description.trim() === ''
    //     ) {
    //         setFormError(true);
    //         return;
    //     }

    //     console.log(storage)
    //     const storageRef = ref(storage, `houserentalmanagement/images/${uuidv4()}`);
    //     let img = [];
    //     for (let i = 0; i < file.length; i++) {

    //         await uploadBytes(storageRef, file[i]).then((snapshot) => {
    //             console.log('Uploaded a blob or file!');
    //             console.log(snapshot)
    //             getDownloadURL(snapshot.ref).then((url) => {
    //                 img.push(url)
    //                 console.log(url);
    //             });
    //         });
    //     }
    //     console.log(img)
    //     await setPhotos(img);
    //     console.log(photos)
    //     const requestObject = {
    //         address: address,
    //         state: state,
    //         city: city,
    //         zip: zip,
    //         contact: contact,
    //         propertyType: propertyType,
    //         bedNo: beds,
    //         bathNo: baths,
    //         sqft: sqft,
    //         rentPrice: price,
    //         pictures: photos,
    //         description: description
    //     };

    //     console.log(requestObject)
    //     debugger;
    //     fetch('http://localhost:3001/property/create', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(requestObject)
    //     }).then(response => {
    //         if (!response.ok) {
    //             throw new Error('Request failed');
    //         }
    //         return response.json();
    //     })
    //         .then(data => {
    //             alert('Request successful');
    //             // Do something with the response data
    //         })
    //         .catch(error => {
    //             alert('Request failed: ' + error.message);
    //         });
    // };


    const handleSubmit = async (event) => {
        console.log("Files array:", file);  // Log the entire file array
        event.preventDefault();
        
        if (
            address.trim() === '' || propertyType.trim() === '' ||
            beds.trim() === '' || baths.trim() === '' ||
            sqft.trim() === '' || price.trim() === '' ||
            description.trim() === ''
        ) {
            setFormError(true);
            return;
        }
    
        let img = [];
        for (let i = 0; i < file.length; i++) {
            // Log the individual file being processed
            console.log("File at index", i, ":", file[i]);
            
            // Check if file exists
            if (!file[i]) {
                console.error("File at index", i, "is undefined or null");
                continue;  // Skip this file and move to the next one
            }
    
            // Generate a unique file name for each file
            const uniqueFileName = `houserentalmanagement/images/${uuidv4()}`;
            const storageRef = ref(storage, uniqueFileName);
            
            // Try uploading the file
            try {
                const snapshot = await uploadBytes(storageRef, file[i]);
                const url = await getDownloadURL(snapshot.ref);
                img.push(url);
                console.log("File uploaded successfully. URL:", url);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    
        console.log(img);
        setPhotos(img);
        
        const requestObject = {
            address: address,
            state: state,
            city: city,
            zip: zip,
            contact: contact,
            propertyType: propertyType,
            bedNo: beds,
            bathNo: baths,
            sqft: sqft,
            rentPrice: price,
            pictures: img,
            description: description
        };
    
        fetch('http://localhost:3001/property/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestObject)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Request failed');
            }
            return response.json();
        }).then(data => {
            alert('Request successful');
        }).catch(error => {
            alert('Request failed: ' + error.message);
        });
    };
    
    

    return (
        <div>
            <div className="property-form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <input
                            type="text"
                            name="address"
                            className='address'
                            value={address}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">State</label>
                        <input
                            type="text"
                            name="state"
                            className='address'
                            value={state}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">City</label>
                        <input
                            type="text"
                            name="city"
                            className='address'
                            value={city}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">ZipCode</label>
                        <input
                            type="text"
                            name="zip"
                            className='address'
                            value={zip}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Contact</label>
                        <input
                            type="text"
                            name="contact"
                            className='address'
                            value={contact}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="propertyType">Property Type</label>
                        <select
                            name="propertyType"
                            value={propertyType}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Property Type</option>
                            <option value="Single House">Single House</option>
                            <option value="Condo/Apartment">Condo/Apartment</option>
                            <option value="Townhouse">Townhouse</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="beds">Beds</label>
                        <input
                            type="number"
                            name="beds"
                            step="1"
                            value={beds}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="baths">Baths</label>
                        <input
                            type="number"
                            name="baths"
                            step="0.5"
                            value={baths}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="sqft">Sqft</label>
                        <input
                            type="text"
                            name="sqft"
                            className='sqft'
                            value={sqft}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Price ($)</label>
                        <input
                            type="text"
                            name="price"
                            className='price'
                            value={price}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Photos</label>
                        <input type="file" onChange={handleChange} accept="" multiple />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            name="description"
                            value={description}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>

                    {formError && (
                        <div className="error-message">
                            Please fill out all the fields before submitting the form.
                        </div>
                    )}
                    <button type="submit">Add Property</button>
                </form>
            </div>
        </div>
    );
};

export default AddPropertyForm;