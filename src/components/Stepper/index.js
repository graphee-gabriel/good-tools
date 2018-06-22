import React from 'react'
import {
  Stepper,
  MobileStepper,
  Step,
  StepLabel,
  StepButton,
  Button
} from '@material-ui/core';
import { withRouter } from 'react-router'

import './index.css'

const WStepper = ({
  match,
  location,
  steps,
  onClickStep,
  ...props
}) => {
  const stepCount = steps.length
  const pathSections = location.pathname.split('/')
  const activeStep = steps.findIndex(({ path }) => pathSections.includes(path))
  const nextStep = activeStep + 1
  const previousStep = activeStep - 1
  const nextStepTitle = nextStep < stepCount && steps[nextStep]
  const previousStepTitle = previousStep > -1 && steps[previousStep]
  return (
    <Stepper
      {...{ activeStep }}
      style={styles.stepper}
    >
      {steps.map(({ title, path, enabled }, i) => {
        const isEnabled = !enabled || enabled(props)
        return (
          <Step key={i}>
            <StepLabel>
              {onClickStep ? (
                <div
                  onClick={() => {
                    if (isEnabled)
                      onClickStep(path, i)
                  }}
                  style={{cursor: isEnabled ? 'pointer' : null}}>
                  {title}
                </div>
              ) : title}
            </StepLabel>
          </Step>
        )
      })}
    </Stepper>

  )
}

/* 
<MobileStepper
  {...{ activeStep }}
  style={styles.stepper}
  steps={stepCount}
  position="static"
  variant="progress"
  backButton={
    <Button>{previousStepTitle ? `< ${previousStepTitle}` : ``}</Button>
  }
  nextButton={
    <Button>{nextStepTitle ? `${nextStepTitle} >` : ``}</Button>
  }
/> 
*/

const styles = {
  viewMain: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  stepper: {
    marginRight: 0,
    overflowX: 'scroll',
    backgroundColor: 'transparent',
    // color: Colors.colorTextDarkBackground,
  },
  step: {
    cursor: 'pointer'
  }
}

WStepper.defaultProps = {

}

export default withRouter(WStepper)