import React from 'react';
import 'rc-steps/assets/index.css';
import { Icon } from 'antd';
import Steps, { Step } from 'rc-steps';
import styles from './ContentSteps.less';

function ContentSteps({ steps, current, showContent, content }) {
  const arrow = arrowTitle => (
    // { styles.nav } 方式无效
    <div className={styles.par}>{arrowTitle}
      <div className={styles.nav} />
    </div>
  );

  return (
    <div>
      <Steps current={current} labelPlacement="vertical" className={styles.processSteps} status="process">
        {
        steps.map((step, i) => {
          if (i < current) {
            return <Step key={step.title} className={styles.custStepFinish} icon={<Icon type="check-circle" style={{ color: '#008B41', fontSize: 28 }} />} {...step} />;
          } else if (i === current) {
            return showContent ? <Step key={step.title} className={styles.custStepProcess} {...{ ...step, ...{ title: arrow(step.title) } }} /> : <Step key={step.title} className={styles.custStepProcess} {...step} />;
          } else {
            return <Step key={step.title} {...step} className={styles.custStepWait} />;
          }
        })
      }
      </Steps>

      {showContent && <div className={styles.stepContent}>{content}</div>}
    </div>
  );
}

export default ContentSteps;
