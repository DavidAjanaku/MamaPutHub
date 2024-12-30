import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Minus, ImagePlus, Trash2 } from "lucide-react";
import { account, storage } from "../services/appwriteConfig";
import { createRecipe } from "../services/appwriteConfig";
import { v4 as uuidv4 } from "uuid";



import { tags } from "../components/Tags";



const LevelTags = [
  { name: "Easy" },
  { name: "Medium" },
  { name: "Like a PRO" },
];

function StepForm({ steps, setSteps, setFormData }) {
  const handleChange = (e, index) => {
    const { value } = e.target;
    const updatedSteps = [...steps];
    updatedSteps[index].name = value;
    setSteps(updatedSteps);
    setFormData(prev => ({
      ...prev,
      steps: updatedSteps.map(step => step.name)
    }));
  };

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={index} className="relative">
          <input
            type="text"
            value={step.name}
            onChange={(e) => handleChange(e, index)}
            placeholder={`Step ${index + 1}`}
            className="w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
          {index > 0 && (
            <button
              onClick={() => {
                const newSteps = steps.filter((_, i) => i !== index);
                setSteps(newSteps);
                setFormData(prev => ({
                  ...prev,
                  steps: newSteps.map(step => step.name)
                }));
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      ))}
      <button
        onClick={() => setSteps([...steps, { name: "" }])}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <Plus size={18} /> Add Step
      </button>
    </div>
  );
}

export default function NewRecipe() {
  const [step, setStep] = useState(1);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [steps, setSteps] = useState([{ name: "" }]);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    picture: "",
    name: "",
    description: "",
    level: "",
    servings: 1,
    type: "",
    ingredients: [],
    steps: [],
    userId: "",
    username: ""
  });

  useEffect(() => {
    account.get().then(
      (response) => {
        setFormData(prev => ({
          ...prev,
          userId: response.$id,
          username: response.name
        }));
      },
      (error) => console.error(error)
    );
  }, []);

  const handlePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedPicture(URL.createObjectURL(file));
    const fileId = uuidv4();

    try {
      await storage.createFile("647e6735532e8f214235", fileId, file);
      const urlLink = `https://cloud.appwrite.io/v1/storage/buckets/647e6735532e8f214235/files/${fileId}/view?project=64676cf547e8830694b8&mode=admin`;
      
      setFormData(prev => ({
        ...prev,
        picture: urlLink
      }));
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createRecipe(formData);
      console.log('Recipe created:', response);
      navigate("/AllDone");
    } catch (error) {
      console.error('Error creating recipe:', error);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center gap-2 mt-8">
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full ${
            step === i ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Recipe</h1>

        {step === 1 && (
          <div className="space-y-6">
            <div className="relative">
              <div 
                className="w-full h-64 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden"
                style={{
                  backgroundImage: selectedPicture ? `url(${selectedPicture})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!selectedPicture && (
                  <div className="text-center">
                    <ImagePlus size={48} className="mx-auto text-gray-400" />
                    <p className="mt-2 text-gray-500">Click to add recipe image</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                onChange={handlePictureUpload}
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipe Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="e.g., Homemade Pizza"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Servings
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, servings: Math.max(1, prev.servings - 1) }))}
                    className="p-2 rounded-lg border hover:bg-gray-100"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="text-xl font-medium">{formData.servings}</span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, servings: prev.servings + 1 }))}
                    className="p-2 rounded-lg border hover:bg-gray-100"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                rows={4}
                placeholder="Describe your recipe..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty Level
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                >
                  <option value="">Select level</option>
                  {LevelTags.map(tag => (
                    <option key={tag.name} value={tag.name}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                >
                  <option value="">Select category</option>
                  {tags.map(tag => (
                    <option key={tag.name} value={tag.name}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Recipe Steps</h2>
            <StepForm
              steps={steps}
              setSteps={setSteps}
              setFormData={setFormData}
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Review Your Recipe</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700">Basic Info</h3>
                <dl className="mt-2 space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Name</dt>
                    <dd className="text-sm font-medium">{formData.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Servings</dt>
                    <dd className="text-sm font-medium">{formData.servings}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Level</dt>
                    <dd className="text-sm font-medium">{formData.level}</dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700">Recipe Details</h3>
                <dl className="mt-2 space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Description</dt>
                    <dd className="text-sm">{formData.description}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Category</dt>
                    <dd className="text-sm font-medium">{formData.type}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {selectedPicture && (
              <img
                src={selectedPicture}
                alt="Recipe"
                className="w-full h-48 object-cover rounded-lg"
              />
            )}

            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Steps</h3>
              <ol className="list-decimal list-inside space-y-2">
                {formData.steps.map((step, index) => (
                  <li key={index} className="text-sm">{step}</li>
                ))}
              </ol>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(prev => prev - 1)}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              Previous
            </button>
          )}
          
          {step < 4 ? (
            <button
              onClick={() => setStep(prev => prev + 1)}
              className="ml-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="ml-auto px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Create Recipe
            </button>
          )}
        </div>

        {renderStepIndicator()}
      </div>
    </div>
  );
}