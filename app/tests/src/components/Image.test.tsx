import { render } from 'tests/test-utils';
import Image from '@/components/Image';

describe('Image component', () => {
  it('Should render Avatar component', () => {
    const { container } = render(<Image name="abc" />);
    expect(container.querySelectorAll('.MuiAvatar-root')!.length).toEqual(1);
  });
  it('Should render NextImage component', () => {
    const { container } = render(<Image image={{ src: "/logo.png", width: 20, height: 20 }} name="abc" />);
    const image = container.querySelector('[data-testid="image"]')
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('data-nimg', 'intrinsic');
  });
  it('Should render img tag', () => {
    const { container } = render(<Image image={{ src: "https://fakeimg.pl/300/", width: 20, height: 20 }} name="abc" />);
    const image = container.querySelector('img')
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('data-testid', 'image');
    expect(image).not.toHaveAttribute('data-nimg', 'intrinsic');
  });
  it('Should render img tag without src', () => {
    const { container } = render(<Image image={{ src: "", width: 20, height: 20 }} name="abc" />);
    const image = container.querySelector('img')
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('data-testid', 'image');
    expect(image).toHaveAttribute('src', 'abc'.slice(0, 1).toUpperCase());
    expect(image).not.toHaveAttribute('data-nimg', 'intrinsic');
  });
});
