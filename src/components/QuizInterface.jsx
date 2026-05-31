import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';

// Mock data generator
const getQuestions = (buildingTitle) => {
  if (buildingTitle.includes('Algebra')) {
    return [
      { type: 'interactive', q: 'Algebraic Design: Set variables X and Y so the equation (X * Y * 2) equals 24.', targetVolume: 24 },
      { type: 'multiple_choice', q: 'Solve the equation: 5x + 10 = 35', options: ['x = 5', 'x = 3', 'x = 10', 'x = 7'], answer: 0 },
      { type: 'multiple_choice', q: 'Find the value of y if 2y - 4 = 12', options: ['y = 4', 'y = 6', 'y = 8', 'y = 10'], answer: 2 }
    ];
  } else if (buildingTitle.includes('Geometry')) {
    return [
      { type: 'interactive', q: 'Spatial Reasoning: Design a 3D structure with an exact volume of 36m³.', targetVolume: 36 },
      { type: 'multiple_choice', q: 'What is the area of a rectangle with length 8 and width 3?', options: ['11', '24', '30', '16'], answer: 1 },
      { type: 'multiple_choice', q: 'The sum of angles in a triangle is always:', options: ['90°', '180°', '360°', '270°'], answer: 1 }
    ];
  } else if (buildingTitle.includes('Data')) {
    return [
      { type: 'interactive', q: 'Server Allocation: Configure the data center racks (X and Y) to reach exactly 24 Petabytes capacity.', targetVolume: 24 },
      { type: 'multiple_choice', q: 'Which chart is best for showing proportions of a whole?', options: ['Bar Chart', 'Line Graph', 'Pie Chart', 'Scatter Plot'], answer: 2 },
      { type: 'multiple_choice', q: 'What is the median of: 2, 5, 8, 12, 15?', options: ['5', '8', '10', '12'], answer: 1 }
    ];
  } else if (buildingTitle.includes('AI')) {
    return [
      { type: 'interactive', q: 'Neural Weights: Adjust the network hidden layers (X and Y) to reach exactly 18 processing units.', targetVolume: 18 },
      { type: 'multiple_choice', q: 'Which is a core concept of Machine Learning?', options: ['Pattern Recognition', 'Hardcoded Rules', 'Random Guessing', 'Manual Sorting'], answer: 0 },
      { type: 'multiple_choice', q: 'What does AI use to improve its predictions?', options: ['Electricity', 'Training Data', 'Hardware', 'Monitors'], answer: 1 }
    ];
  } else if (buildingTitle.includes('Cyber')) {
    return [
      { type: 'interactive', q: 'Encryption Matrix: Set the encryption grid dimensions (X and Y) to exactly 36 blocks to secure the data.', targetVolume: 36 },
      { type: 'multiple_choice', q: 'What is a Firewall used for?', options: ['Cooling computers', 'Filtering network traffic', 'Writing code', 'Speeding up internet'], answer: 1 },
      { type: 'multiple_choice', q: 'Which is an example of strong encryption practice?', options: ['Using password "1234"', 'Writing passwords on paper', 'Hashing with salt', 'Sending passwords in plain text'], answer: 2 }
    ];
  }
  
  // Fallback
  return [
    { type: 'interactive', q: `Design a core for ${buildingTitle} with 24m³ volume.`, targetVolume: 24 },
    { type: 'multiple_choice', q: 'Basic Math: 5 * 6 = ?', options: ['20', '30', '40', '50'], answer: 1 }
  ];
};

function InteractiveChallenge({ color, targetVolume, onCorrect }) {
  const [width, setWidth] = useState(3);
  const [height, setHeight] = useState(3);
  const depth = 2;
  const currentVolume = width * height * depth;
  const isCorrect = currentVolume === targetVolume;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      <div style={{ height: '280px', width: '100%', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', overflow: 'hidden' }}>
        <Canvas camera={{ position: [6, 6, 6], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
          <mesh castShadow position={[0, height/2, 0]}>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color={isCorrect ? '#2ed573' : color} roughness={0.2} metalness={0.6} />
          </mesh>
          <ContactShadows position={[0, 0, 0]} opacity={0.6} scale={20} blur={2} />
          <OrbitControls autoRotate autoRotateSpeed={3} enableZoom={false} />
        </Canvas>
      </div>

      <div style={{ display: 'flex', gap: '2rem', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a0a0b0', marginBottom: '10px' }}>
            <span>Width (X)</span> <span style={{color: '#fff', fontWeight: 'bold'}}>{width}m</span>
          </div>
          <input type="range" min="1" max="6" value={width} onChange={e => setWidth(parseInt(e.target.value))} style={{ width: '100%', accentColor: color }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a0a0b0', marginBottom: '10px' }}>
            <span>Height (Y)</span> <span style={{color: '#fff', fontWeight: 'bold'}}>{height}m</span>
          </div>
          <input type="range" min="1" max="6" value={height} onChange={e => setHeight(parseInt(e.target.value))} style={{ width: '100%', accentColor: color }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minWidth: '120px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1rem' }}>
          <span style={{ color: '#a0a0b0', fontSize: '0.8rem', letterSpacing: '1px' }}>DEPTH: 2m</span>
          <div style={{ color: isCorrect ? '#2ed573' : '#fff', fontSize: '2rem', fontWeight: 'bold', textShadow: isCorrect ? '0 0 15px #2ed573' : 'none' }}>
            {currentVolume} <span style={{fontSize: '1rem'}}>m³</span>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
        <motion.button
          whileHover={isCorrect ? { scale: 1.05 } : {}}
          whileTap={isCorrect ? { scale: 0.95 } : {}}
          onClick={onCorrect}
          disabled={!isCorrect}
          style={{
            padding: '16px 50px', fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '14px',
            background: isCorrect ? '#2ed573' : '#333',
            color: isCorrect ? '#fff' : '#666',
            border: 'none', cursor: isCorrect ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s', boxShadow: isCorrect ? '0 10px 25px rgba(46,213,115,0.4)' : 'none',
            textTransform: 'uppercase', letterSpacing: '1px'
          }}
        >
          {isCorrect ? 'Construct Building 🏗️' : 'Match Target Volume'}
        </motion.button>
      </div>
    </div>
  );
}

export default function QuizInterface({ building, level, onComplete, onExit }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  
  const questions = getQuestions(building.title);
  const question = questions[currentQuestion];
  const progress = ((currentQuestion) / questions.length) * 100;

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setIsChecked(false);
    } else {
      onComplete();
    }
  };

  const handleMCQCheck = () => {
    if (selectedOption === null) return;
    setIsChecked(true);
    setTimeout(nextQuestion, 2000);
  };

  const getOptionStyle = (index) => {
    if (!isChecked) {
      return selectedOption === index 
        ? { background: `${building.color}30`, borderColor: building.color, color: '#fff', scale: 1.02 }
        : { background: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#a0a0b0', scale: 1 };
    }
    
    if (index === question.answer) {
      return { background: 'rgba(46, 213, 115, 0.2)', borderColor: '#2ed573', color: '#2ed573', scale: 1.05 }; 
    }
    if (selectedOption === index && index !== question.answer) {
      return { background: 'rgba(255, 71, 87, 0.2)', borderColor: '#ff4757', color: '#ff4757', scale: 0.95 }; 
    }
    return { background: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(255, 255, 255, 0.05)', color: '#555', scale: 1 };
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, type: 'spring' }}
      style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'rgba(5, 5, 12, 0.9)', backdropFilter: 'blur(20px)',
        zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', padding: '2rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: building.color }}>{building.title}</span> <span style={{ color: '#555' }}>|</span> Level {level.id}
          </h2>
        </div>
        <button 
          onClick={onExit}
          style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.target.style.background = 'transparent'}
        >
          Exit Challenge
        </button>
      </div>

      <div style={{ position: 'absolute', top: '80px', left: '3rem', right: '3rem', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
        <motion.div 
          initial={{ width: `${progress}%` }}
          animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.5 }}
          style={{ height: '100%', background: building.color }}
        />
      </div>

      <div style={{ maxWidth: '900px', width: '100%', padding: '2rem' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <span style={{ display: 'inline-block', color: building.color, fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem', padding: '5px 15px', background: `${building.color}20`, borderRadius: '20px' }}>
                Challenge {currentQuestion + 1} of {questions.length}
              </span>
              <h1 style={{ color: '#fff', fontSize: '2rem', margin: 0, lineHeight: '1.4' }}>
                {question.q}
              </h1>
            </div>

            {question.type === 'interactive' ? (
              <InteractiveChallenge 
                color={building.color} 
                targetVolume={question.targetVolume} 
                onCorrect={nextQuestion} 
              />
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  {question.options.map((opt, index) => {
                    const styles = getOptionStyle(index);
                    return (
                      <motion.button
                        key={index}
                        onClick={() => !isChecked && setSelectedOption(index)}
                        whileHover={!isChecked && selectedOption !== index ? { scale: 1.02, background: 'rgba(255,255,255,0.08)' } : {}}
                        animate={styles}
                        style={{
                          padding: '1.5rem', borderRadius: '16px', border: '2px solid',
                          fontSize: '1.2rem', textAlign: 'left', cursor: isChecked ? 'default' : 'pointer',
                          display: 'flex', alignItems: 'center', gap: '15px',
                          transition: 'border-color 0.2s, color 0.2s'
                        }}
                      >
                        <div style={{ 
                          width: '30px', height: '30px', borderRadius: '8px', 
                          background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 'bold', fontSize: '1rem'
                        }}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>

                <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
                  <motion.button
                    whileHover={selectedOption !== null && !isChecked ? { scale: 1.05, boxShadow: `0 10px 25px ${building.color}60` } : {}}
                    whileTap={selectedOption !== null && !isChecked ? { scale: 0.95 } : {}}
                    onClick={handleMCQCheck}
                    disabled={selectedOption === null || isChecked}
                    style={{
                      padding: '16px 40px', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '14px',
                      background: selectedOption !== null ? building.color : '#333',
                      color: selectedOption !== null ? '#fff' : '#666',
                      border: 'none', cursor: selectedOption !== null && !isChecked ? 'pointer' : 'not-allowed',
                      transition: 'background 0.3s'
                    }}
                  >
                    {isChecked ? (selectedOption === question.answer ? 'Excellent! 🎉' : 'Incorrect ❌') : 'Verify Answer'}
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
