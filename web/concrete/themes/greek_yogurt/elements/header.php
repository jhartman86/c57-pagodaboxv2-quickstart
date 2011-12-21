<?php  defined('C5_EXECUTE') or die("Access Denied."); ?>
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="utf-8" />

<!-- Site Header Content //-->

<link rel="stylesheet" href="<?php echo $this->getThemePath(); ?>/css/reset.css" />
<link rel="stylesheet" href="<?php echo $this->getThemePath(); ?>/css/text.css" />
<link rel="stylesheet" href="<?php echo $this->getThemePath(); ?>/css/960_24_col.css" />
<link rel="stylesheet" media="screen" type="text/css" href="<?php echo $this->getStyleSheet('main.css')?>" />
<link rel="stylesheet" media="screen" type="text/css" href="<?php echo $this->getStyleSheet('typography.css')?>" />
<link href='http://fonts.googleapis.com/css?family=Merriweather:400,700,900,300' rel='stylesheet' type='text/css' />

<?php  Loader::element('header_required'); ?>

</head>

<body>

<!--start main container -->

<div id="main-container" class="container_24">

	<div id="header">
	
	
		<?php 
		$a = new GlobalArea('Site Name');
		$a->display();
		?>

		<?php 
		$a = new GlobalArea('Header Nav');
		$a->display();
		?>
		
		<div id="header-image">
		
			<?php 
			$a = new Area('Header');
			$a->display($c);
			?>
		
		</div>
		
	</div>
	
	<div class="clear"></div>