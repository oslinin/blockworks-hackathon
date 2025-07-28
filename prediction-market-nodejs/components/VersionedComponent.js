
import { useVersion } from '@/context/VersionContext';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const VersionedComponent = ({ componentName, ...props }) => {
  const { version } = useVersion();
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    if (version) {
      const DynamicComponent = dynamic(() =>
        import(`@/components/${componentName}/${version}`).catch(() => import(`@/components/${componentName}/v1`))
      );
      setComponent(() => DynamicComponent);
    }
  }, [version, componentName]);

  if (!Component) {
    return <div>Loading...</div>;
  }

  return <Component {...props} />;
};

export default VersionedComponent;
